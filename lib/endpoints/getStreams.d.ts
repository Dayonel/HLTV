import { HLTVConfig } from '../config';
import { Country } from '../shared/Country';
export declare enum StreamCategory {
    TopPlayer = "Top player",
    Caster = "Caster",
    FemalePlayer = "Female Player"
}
export interface FullStream {
    name: string;
    category: StreamCategory;
    country: Country;
    hltvLink: string;
    realLink?: string;
    viewers: number;
}
export declare const getStreams: (config: HLTVConfig) => ({ loadLinks }?: {
    loadLinks?: boolean | undefined;
}) => Promise<FullStream[]>;
