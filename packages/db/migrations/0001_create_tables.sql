-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created" DATETIME NOT NULL,
    "description" TEXT,
    "context_length" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Architecture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tokenizer" TEXT,
    "instruct_type" TEXT,
    "modality" TEXT,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "Architecture_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pricing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prompt" TEXT,
    "completion" TEXT,
    "request" TEXT,
    "image" TEXT,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "Pricing_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TopProvider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "context_length" INTEGER,
    "max_completion_tokens" INTEGER,
    "is_moderated" BOOLEAN,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "TopProvider_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PerRequestLimits" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prompt_tokens" TEXT,
    "completion_tokens" TEXT,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "PerRequestLimits_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Parameters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT,
    "frequency_penalty_p10" REAL,
    "frequency_penalty_p50" REAL,
    "frequency_penalty_p90" REAL,
    "min_p_p10" REAL,
    "min_p_p50" REAL,
    "min_p_p90" REAL,
    "presence_penalty_p10" REAL,
    "presence_penalty_p50" REAL,
    "presence_penalty_p90" REAL,
    "repetition_penalty_p10" REAL,
    "repetition_penalty_p50" REAL,
    "repetition_penalty_p90" REAL,
    "temperature_p10" REAL,
    "temperature_p50" REAL,
    "temperature_p90" REAL,
    "top_a_p10" REAL,
    "top_a_p50" REAL,
    "top_a_p90" REAL,
    "top_k_p10" REAL,
    "top_k_p50" REAL,
    "top_k_p90" REAL,
    "top_p_p10" REAL,
    "top_p_p50" REAL,
    "top_p_p90" REAL,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "Parameters_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupportedParameters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "parametersId" INTEGER,
    CONSTRAINT "SupportedParameters_parametersId_fkey" FOREIGN KEY ("parametersId") REFERENCES "Parameters" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Architecture_modelId_key" ON "Architecture"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "Pricing_modelId_key" ON "Pricing"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "TopProvider_modelId_key" ON "TopProvider"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "PerRequestLimits_modelId_key" ON "PerRequestLimits"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "Parameters_modelId_key" ON "Parameters"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportedParameters_parametersId_key" ON "SupportedParameters"("parametersId");
