import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import QRCode from 'qrcode';
import { TrxService } from '../../services/trx.service';

/**
 * Shows a QR code representing a URL that the user can scan with their phone. Meant for ELD mode -- on ELD mode, the app is not allowed
 * to use data, and we can't assume that the device's browser will be allowed to go to any website.
 * We show a QR code so that instead of browsing to a URL, the user scans a QR code with his personal phone and browses the URL there.
 */

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss']
})
export class QrModalComponent implements OnInit {

  @ViewChild( 'canvas', { static: true } ) canvas: ElementRef<HTMLCanvasElement>;

  @Input() url: string;

  public modal: HTMLIonModalElement;

  action: string;
  
  constructor(
    public trx: TrxService
  ) { }

  async ngOnInit() {
    let qrContents: string;
    let errorCorrection = 'M';

    // construct a description that makes sense, and convert from URL-style actions to QR-style actions
    if ( this.url.startsWith('http') ) {
      this.action = await this.trx.t( 'misc.qrCode.visit', { target: this.url } );
      qrContents = this.url;
    } else if ( this.url.startsWith('sms:') ) {
      const matches = this.url.match( /^sms:(.*?)(\?body=(.*?))?$/ );
      const textTo = matches[1];
      const messageBody = matches[3];
      this.action = await this.trx.t( 'misc.qrCode.sendSms', { target: textTo } );
      qrContents = `SMSTO:${textTo}` + ( messageBody == null ? '' : `:${messageBody}` );
    } else if ( this.url.startsWith('tel:') ) {
      this.action = await this.trx.t( 'misc.qrCode.call', { target: this.url.replace( /tel:(.*)/, '$1' ) } );
      qrContents = this.url;
    } else if ( this.url.startsWith('mailto:') ) {
      const matches = this.url.match( /^mailto:(.*?)(\?subject=(.*?)&body=(.*?))?$/ );
      const address = matches[1];
      const subject = matches[3] ? `SUB:${decodeURIComponent(matches[3]).replace(/;/g,'.')};` : '';
      const body = matches[4] ? `BODY:${decodeURIComponent(matches[4]).replace(/;/g,'.')};` : '';
      this.action = await this.trx.t( 'misc.qrCode.sendEmail', { target: address } );
      qrContents = `MATMSG:TO:${address};${subject}${body};`;
      errorCorrection = 'L';
    }

    QRCode.toCanvas( this.canvas.nativeElement, qrContents, { width: 1000, errorCorrectionLevel: errorCorrection as any } );
  }

}
