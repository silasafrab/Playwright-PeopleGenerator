import { test } from "@playwright/test";

test("Gera apenas uma pessoa", async ({ page }) => {
  try {
    // Etapa 1: Acesse a página do gerador de pessoas
    await page.goto("https://www.4devs.com.br/gerador_de_pessoas", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Etapa 2: Define o sexo como feminino
    await page.waitForSelector("#sexo_mulher");
    await page.evaluate(() => {
      (document.querySelector("#sexo_mulher") as HTMLInputElement).checked =
        true;
    });

    // Etapa 3: Define a idade igual a 25
    await page.selectOption("#idade", { value: "25" });

    // Etapa 4: Define o estado como Bahia
    await page.selectOption("#cep_estado", { value: "BA" });

    // Etapa 5: Define a cidade como Itabuna
    await page.selectOption("#cep_cidade", { value: "683" });

    // Etapa 6: Define a pontuação como não
    await page.evaluate(() => {
      (document.querySelector("#pontuacao_nao") as HTMLInputElement).checked =
        true;
    });

    // Etapa 7: Define a quantidade como 1
    await page.fill("#txt_qtde", "1");

    // Etapa 8: Gera os dados
    await page.click("#bt_gerar_pessoa");
  } catch (error) {
    console.error("Ocorreu um erro:", error);
  }
});
