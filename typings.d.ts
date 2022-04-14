import { Compiler, Compilation } from "webpack";
export = InjectTagsHtmlWebpackPlugin
declare namespace InjectTagsHtmlWebpackPlugin {
    interface options {
        title?: string,
        styles?: [{
            [key: string]: string | Object,
            href: string,
            content: string,
            rel: string,
            otherAttributes?: Object
        }],
        scripts?: [{
            [key: string]: string | Object,
            src?: string,
            content?: string,
            otherAttributes?: Object,
        }],
        meta?: [{
            [key: string]: string,
            name: string,
            content: string
        }]
    }
}
declare class InjectTagsHtmlWebpackPlugin {
    constructor(options: InjectTagsHtmlWebpackPlugin.options)
    apply(compilation: Compilation): void
    static readonly version: number;
}