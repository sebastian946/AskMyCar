from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from config.config import get_llm


template = """
    Responde las preguntas del vehiculo basandote en el manual teniendo en cuenta la marca todo

    {context}

    Pregunta: {question}
"""

class ManualQAChain:
    def __init__(self,retriever) -> None:
        self.retriever = retriever

    def ask(self, question: str) -> dict:
        docs = self.retriever.invoke(question)
        context = "\n\n".join(doc.page_content for doc in docs)

        prompt = ChatPromptTemplate.from_template(template)
        llm = get_llm()
        chain = prompt | llm | StrOutputParser()
        answer = chain.invoke({"context": context, "question": question})

        sources = [doc.page_content[:300].replace("\n", " ").strip() for doc in docs]
        return {"answer": answer, "sources": sources}

    def text_prompt(self, question: str) -> str:
        return self.ask(question)["answer"]
