class Logs {
    private INFO: string = "INFO";
    private WARN: string = "WARN";
    private ERRO: string = "ERRO";

    /**
     * Private method for show console.log with structur.
     * @param {string} type. Type of message print in console.
     * @param {string} msg. Message to print in console.
     */
    private WriteLogs = (type: string, msg: string) => {
        const nowDate: Date = new Date();
        // tslint:disable-next-line:no-console
        console.log(`[${nowDate.toLocaleString()}]-[${type}]`, msg);
    }

    /**
     * Logs show for info message in console
     * @param {any} msg. Object to show in console
     */
    public Log = (msg: any) => {
        this.WriteLogs(this.INFO, JSON.stringify(msg));
    }

    /**
     * Logs show for error message in console
     * @param {any} msg. Object to show in console
     */
    public Error = (msg: any) => {
        this.WriteLogs(this.INFO, JSON.stringify(msg));
    }

    /**
     * Logs show for warnings message in console
     * @param {any} msg. Object to show in console
     */
    public Warning = (msg: any) => {
        this.WriteLogs(this.WARN, JSON.stringify(msg));
    }

}
export default new Logs();
