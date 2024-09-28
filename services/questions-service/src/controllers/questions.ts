import { Prisma, db } from "@peerprep/db";
import type { NewQuestion, Question, UpdateQuestion } from "@peerprep/schemas";
import { ExpectedError } from "@peerprep/utils/server";
import { StatusCodes } from "http-status-codes";

export async function createQuestions(questions: NewQuestion | NewQuestion[]) {
  try {
    await db.question.createMany({ data: questions });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      throw new ExpectedError("Question ID already exists", StatusCodes.CONFLICT);
    throw error;
  }
}

export async function getQuestion(id: string): Promise<Question> {
  const question = await db.question.findUnique({ where: { id } });
  if (!question) throw new ExpectedError(`Question ${id} not found`, StatusCodes.NOT_FOUND);
  return question;
}

export async function getAllQuestions(): Promise<Question[]> {
  return db.question.findMany();
}

export async function updateQuestion(id: string, question: UpdateQuestion) {
  try {
    await db.question.update({ where: { id }, data: question });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      throw new ExpectedError("A clash with another question occurred", StatusCodes.CONFLICT);
    throw error;
  }
}

export async function deleteQuestion(id: string) {
  const question = await db.question.delete({ where: { id } });
  if (!question) throw new ExpectedError(`Question ${id} not found`, StatusCodes.NOT_FOUND);
}
