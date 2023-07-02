import swaggerAutogen from "swagger-autogen";

const swaggerDoc = {
  info: {
    title: "Progetto finale Programmazione Web e Mobile - Social Network for Music (SNM)",
    description:
      "Documentazione delle API del progetto finale di Programmazione Web e Mobile",
  },
  host: "localhost:3001",
};

swaggerAutogen()("./swagger-output.json", ["./src/index.ts"], swaggerDoc);
