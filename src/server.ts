import app from './app';
import { PORT } from './config/env';

const port = PORT || 5000;

app.listen(PORT, () => console.log(`app started on port ${port}`));