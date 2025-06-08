<h1 align="center">Front-end do site da SAEComp</h1>



## Como rodar para desenvolvimento
Adicionar .env com:
```ini
VITE_TEACHER_EVALUATION_API_URL=
VITE_AUTH_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

`npm install`

`npm run dev`

## Como criar a build do projeto

`npm install`

`npm run build`

Os arquivos de build ficam disponíveis no diretório `dist`

## Como fazer contribuições
Utilize o [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) como fluxo para alterar o código do repositório

Exemplo:
1. **Crie uma nova branch a partir da `main`**:
```bash
git checkout -b feature/<nome-da-feature>
```
2. **Faça as alterações localmente e use commits seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/)**:

`feat: <descrição da feature>`

`fix: <descrição do erro corrigido>`

3. **Suba a branch para o GitHub**:
```bash
git push origin feature/<nome-da-feature>
```

4. **Abra um PR (pull request) para a branch main**:
- Descreva o que foi feito
- Relacione algum issue, caso ele exista
- Escolha pelo menos um revisor para aprovar sua alteração

5. **Caso o PR seja aprovado, faça merge na main**

<p align="center"> 
© <a href="mailto:saecomp@usp.br">SAEComp</a> <3 
<br>
Secretaria Acadêmica da Engenharia de Computação | USP São Carlos
</p>

