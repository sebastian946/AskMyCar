from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from config.config import get_llm
from rag.load_document import LoadManual


template = """
    Responde las preguntas del vehiculo basandote en el manual teniendo en cuenta la marca todo

    {context}

    Pregunta: {question}
"""

class ManualQAChain:
    def __init__(self, brand, model, year) -> None:
        manual = LoadManual(brand, model, year)
        self.retriever = manual.retriever()

    def text_prompt(self, question: str) -> str:
        prompt = ChatPromptTemplate.from_template(template)
        llm = get_llm()

        rag_chain = (
            {"context": self.retriever, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

        return rag_chain.invoke(question)
