import { app } from "./app";
const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
