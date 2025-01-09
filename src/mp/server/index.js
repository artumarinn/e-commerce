import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar el cliente de MercadoPago
const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN,
});

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Soy el server");
});

app.post("/api/create_preference", async (req, res) => {
    try {
        const preference = new Preference(client);
        const preferenceData = {
            items: [{
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.price),
                currency_id: "ARS",
            }],
            back_urls: {
                success: "https://www.youtube.com/watch?v=vEXwN9-tKcs",
                failure: "https://www.youtube.com/watch?v=vEXwN9-tKcs",
                pending: "https://www.youtube.com/watch?v=vEXwN9-tKcs",
            },
            auto_return: "approved",
        };

        const response = await preference.create({ body: preferenceData });
        res.json({
            id: response.id
        });
    } catch (error) {
        console.error("Error al crear la preferencia:", error);
        res.status(500).json({ message: "Error al crear la preferencia" });
    }
});

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});
