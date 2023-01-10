import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id;

    const result = accounts.find(account => account.id === id);

    res.status(200).send(result);
})

app.delete("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id;

    const indexToRemove = accounts.findIndex(account => account.id === id);
    if (indexToRemove >= 0){
        accounts.splice(indexToRemove, 1);
    }
    
    res.status(200).send("Item deletado com sucesso");
})

app.put("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id;

    const newId = req.body.id as string | undefined;
    const newOwnerName = req.body.ownerName as string | undefined;
    const newBalance = req.body.balance as number | undefined;
    const newType = req.body.type as ACCOUNT_TYPE | undefined;

    const accountToEdit = accounts.find(account => account.id === id);

    if (accountToEdit){
        accountToEdit.id = newId || accountToEdit.id;
        accountToEdit.ownerName = newOwnerName || accountToEdit.ownerName;
        accountToEdit.type = newType || accountToEdit.type;

        accountToEdit.balance = isNaN(newBalance) ? accountToEdit.balance : newBalance;
    }   

    res.status(200).send("Atualização realizada com sucesso");
});
