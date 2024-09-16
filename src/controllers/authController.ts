import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import prisma from '../models/user'
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    try {
        if (!password) {
            res.status(400).json({ error: "El password es requerido" });
            return;
        }
        if (!email) {
            res.status(400).json({ error: "El email es requerido" });
            return;
        }

        const hashedPassword = await hashPassword( password );
        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )
        const token = generateToken(user)
        res.status(201).json({ token });
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
             res.status(400).json({ error: "El email ya existe" });
             return;
        }
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ error: "El email es requerido" });
            return;
        }
        if (!password) {
            res.status(400).json({ error: "La contraseña es requerida" });
            return;
        }
        const user = await prisma.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado'});
            return;
        }
        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Usuario y Contraseña no coinciden'});
            return;
        }
        const token = generateToken(user)
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
