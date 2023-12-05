declare function GetParentResourceName(): string;

declare module '*.svg' {
    import React from 'react';
    const SVG: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}
