import Updater from "../state/Updater";

export abstract class DataSource<T> extends Updater {

    private static readonly EMPTY_HANDLER: () => void = () => {
    };

    loading: boolean = false;

    error?: string = null;

    isSucc: boolean = true;

    protected pendingHandler: (succ?: boolean, error?: any, value?: any) => void;

    protected currentHandler: (succ?: boolean, error?: any, value?: any) => void;

    mount = false;

    setMount(mount) {
        this.mount = mount;
    }

    refresh(handler: (succ?: boolean, error?: any, value?: any) => void = null): void {
        this.error = null;
        this.isSucc = true;
        if (!handler) {
            handler = DataSource.EMPTY_HANDLER;
        }
        if (this.loading) {
            this.pendingHandler = handler;
        } else {
            this.currentHandler = handler;
            this.loading = true;
            this.onRefresh();
        }
    }

    protected success(value: T): void {
        if (!this.loading) {
            //ignore
            console.error("当前DataSource并不处于loading状态");
            return;
            //throw new Error("当前DataSource并不处于loading状态");
        }
        if (value && ((value as any).success != false)) {
            this.onSuccess(value);
            this.doUpdate();
        } else {
            //fail or onReset ?
            //this.onReset();
            throw new Error("需要数据");
        }

        //remove finally
        //only success
        try {
            this.currentHandler(true, null, value);
        } catch (error) {
            console.error("success & deal handler fail.", error);
            //ignore this error
        } finally {
            let ph: () => void = this.pendingHandler;
            if (ph) {
                this.pendingHandler = null;
                this.currentHandler = ph;
                this.onRefresh();
            } else {
                this.loading = false;
            }
        }
    }

    protected fail(err: string): void {
        try {
            this.isSucc = false;
            this.error = err;
            this.onFail(this.error);
            this.doUpdate();
        } catch (error) {
            console.error("fail & deal handler fail.", error);
        } finally {
            try {
                this.currentHandler(false, this.error);
            } finally {
                let ph: () => void = this.pendingHandler;
                if (ph) {
                    this.pendingHandler = null;
                    this.currentHandler = ph;
                    this.onRefresh();
                } else {
                    this.loading = false;
                }
            }
        }
    }

    reset(): void {
        this.error = null;
        this.loading = false;
        this.onReset();
    }

    protected onFail(err): void {
    }

    protected abstract onRefresh(): void;

    protected abstract onSuccess(value: T): void;

    protected abstract onReset(): void;

    public abstract get $(): T;
}

export abstract class ObjDataSource<E> extends DataSource<E> {
    $: E;

    protected onSuccess(value: E): void {
        this.$ = value;
    }

    protected onReset(): void {
        this.$ = null;
    }
}
