import { test } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";
import * as xlsx from "xlsx";

test("Gera 30 pessoas e cria tabela", async ({ browser }) => {
  // Cria um novo contexto de navegador com permissões para leitura e escrita na área de transferência
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"], // Permissões de área de transferência
  });
  const page = await context.newPage();

  try {
    // Acessa a página do gerador de pessoas e aguarda o carregamento completo do conteúdo da página
    await page.goto("https://www.4devs.com.br/gerador_de_pessoas", {
      waitUntil: "domcontentloaded",
      timeout: 60000, // Define um timeout de 60 segundos para o carregamento da página
    });

    // Define as opções para gerar os dados
    await page.check("#sexo_mulher"); // Seleciona o gênero "mulher"
    await page.selectOption("#idade", { value: "25" }); // Define a idade para 25 anos
    await page.selectOption("#cep_estado", { value: "BA" }); // Define o estado para "BA" (Bahia)
    await page.selectOption("#cep_cidade", { value: "683" }); // Define a cidade
    await page.check("#pontuacao_nao"); // Desativa a pontuação nos documentos gerados
    await page.fill("#txt_qtde", "30"); // Define a quantidade de pessoas a serem geradas (30)
    await page.click("#bt_gerar_pessoa"); // Clica no botão para gerar as pessoas

    // Clica no botão "Copiar" para copiar os dados gerados para a área de transferência
    await page.click('button[title="Copiar"]');

    // Aguarda brevemente para garantir que a cópia para a área de transferência seja concluída
    await page.waitForTimeout(1000);

    // Lê o conteúdo copiado da área de transferência (os dados gerados)
    const jsonData = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    // Converte os dados JSON em um objeto JavaScript
    const data = JSON.parse(jsonData);

    // Cria uma nova planilha Excel e adiciona os dados
    const workbook = xlsx.utils.book_new();
    const dataWorksheet = xlsx.utils.json_to_sheet(data); // Converte o objeto de dados em uma planilha
    xlsx.utils.book_append_sheet(workbook, dataWorksheet, "Dados"); // Adiciona a planilha ao workbook

    // Define o nome do arquivo com a data e hora atuais
    const currentDateTime = new Date();
    const fileName = `${currentDateTime.getFullYear()}-${String(
      currentDateTime.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDateTime.getDate()).padStart(
      2,
      "0"
    )}_${String(currentDateTime.getHours()).padStart(2, "0")}${String(
      currentDateTime.getMinutes()
    ).padStart(2, "0")}.xlsx`;

    // Define o caminho para salvar o arquivo na pasta "table"
    const dirPath = path.join(process.cwd(), "table");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // Cria a pasta "table" se ela não existir
    }
    const filePath = path.join(dirPath, fileName); // Define o caminho completo para o arquivo

    // Salva o workbook no caminho especificado
    xlsx.writeFile(workbook, filePath);
    console.log(`Planilha salva em: ${filePath}`);

    // Fecha a página após concluir o processo
    await page.close();
  } catch (error) {
    // Captura e exibe qualquer erro ocorrido durante o processo
    console.error("Ocorreu um erro:", error);
  }
});
