import app from './app';
import config from './config';
import { prisma } from './db';

const { port } = config;

async function main() {
  await prisma.$connect();
  console.log('Connected to database');

  app.listen(port, () => {
    console.log(`Started on ${port}`);
  });
}

main().then(async () => {
  await prisma.$disconnect();
})
.catch( async (e) => {
  console.log('Error in index');
  console.log(e);
  await prisma.$disconnect();
  process.exit(1);
});