import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Domain } from "@/server/services/domain";

export interface Schema {
	serverIp: string;
	projectName: string;
}

export type DomainSchema = Pick<Domain, "host" | "port" | "serviceName">;

export interface Template {
	envs?: string[];
	mounts?: {
		filePath: string;
		content?: string;
	}[];
	domains?: DomainSchema[];
}

export const generateRandomDomain = ({
	serverIp,
	projectName,
}: Schema): string => {
	const hash = randomBytes(3).toString("hex");
	const slugIp = serverIp.replaceAll(".", "-");

	return `${projectName}-${hash}${slugIp === "" ? "" : `-${slugIp}`}.traefik.me`;
};

export const generateHash = (projectName: string, quantity = 3): string => {
	const hash = randomBytes(quantity).toString("hex");
	return `${projectName}-${hash}`;
};

export const generatePassword = (quantity = 16): string => {
	return randomBytes(Math.ceil(quantity / 2))
		.toString("hex")
		.slice(0, quantity);
};

export const generateBase64 = (bytes = 32): string => {
	return randomBytes(bytes).toString("base64");
};

export const readTemplateComposeFile = async (id: string) => {
	const cwd = process.cwd();
	const composeFile = await readFile(
		join(cwd, ".next", "templates", id, "docker-compose.yml"),
		"utf8",
	);

	return composeFile;
};