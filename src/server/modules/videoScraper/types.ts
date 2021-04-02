export interface IVideoScraper {
     getVideoSource(): Promise<string[]>
}