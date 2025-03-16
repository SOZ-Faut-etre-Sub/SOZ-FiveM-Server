export function createNamedRenderTargetForModel(name: string, model: number): number {
    if (!IsNamedRendertargetRegistered(name)) {
        RegisterNamedRendertarget(name, false);
    }

    if (!IsNamedRendertargetLinked(model)) {
        LinkNamedRendertarget(model);
    }

    if (IsNamedRendertargetRegistered(name)) {
        return GetNamedRendertargetRenderId(name);
    }

    return 0;
}

export function releaseNamedRenderTarget(name: string): void {
    if (!IsNamedRendertargetRegistered(name)) return;
    ReleaseNamedRendertarget(name);
}
