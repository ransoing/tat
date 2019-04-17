// URLs of scripts hosted in the cloud which need to be loaded dynamically.
// The loading of these scripts is handled in script.service.ts
interface Scripts {
    name: string;
    src: string;
}  
export const ScriptStore: Scripts[] = [
    {name: 'vimeo-player', src: 'https://player.vimeo.com/api/player.js'},
    {name: 'youtube-api', src: 'https://www.youtube.com/iframe_api'},
    {name: 'surveys', src: 'https://tatproxy.ransomchristofferson.com/testscripts/surveys.js' }
];