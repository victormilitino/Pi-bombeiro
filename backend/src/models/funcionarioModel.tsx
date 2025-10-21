export interface FuncaoModel {
    getNomeFuncao(): string;
    getDescricao(): string;
}

export class FuncionarioModel {
    private id: string;
    private nomeFunc: string;
    private telefoneFunc: string;
    private emailFunc: string;
    private disponivel: boolean;
    private funcao?: FuncaoModel;

    constructor(
        id: string,
        nomeFunc: string,
        telefoneFunc: string,
        emailFunc: string,
        disponivel: boolean,
        funcao?: FuncaoModel,
    ) {
        this.id = id;
        this.nomeFunc = nomeFunc;
        this.telefoneFunc = telefoneFunc;
        this.emailFunc = emailFunc;
        this.disponivel = disponivel;
        this.funcao = funcao;
    }

    // Getters and Setters
    public getId(): string {
        return this.id;
    }

    public getNomeFunc(): string {
        return this.nomeFunc;
    }

    public getTelefoneFunc(): string {
        return this.telefoneFunc;
    }

    public getEmailFunc(): string {
        return this.emailFunc;
    }

    public getFuncao(): FuncaoModel | undefined {
        return this.funcao;
    }

    public isDisponivel(): boolean {
        return this.disponivel;
    }

    public setNomeFunc(nomeFunc: string): void {
        this.nomeFunc = nomeFunc;
    }

    public setTelefoneFunc(telefoneFunc: string): void {
        this.telefoneFunc = telefoneFunc;
    }

    public setEmailFunc(emailFunc: string): void {
        this.emailFunc = emailFunc;
    }

    public setDisponivel(disponivel: boolean): void {
        this.disponivel = disponivel;
    }

    public setFuncao(funcao: FuncaoModel | undefined): void {
        this.funcao = funcao;
    }

    public toString(): string {
        const funcaoStr = this.funcao
            ? `Funcao { nome: ${this.funcao.getNomeFuncao()}, descricao: ${this.funcao.getDescricao()} }`
            : 'Funcao: undefined';

        return `FuncionarioModel { id: ${this.id}, nomeFunc: ${this.nomeFunc}, telefoneFunc: ${this.telefoneFunc}, emailFunc: ${this.emailFunc}, disponivel: ${this.disponivel}, ${funcaoStr} }`;
    }
}
