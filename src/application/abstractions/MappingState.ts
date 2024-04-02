export interface MappingState {
    output: any;
    handle(data:any): void;
    getOutput(): string;
}