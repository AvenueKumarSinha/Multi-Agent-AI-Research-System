from agents import build_reader_agent, build_search_agent, writer_chain, critic_chain

def run_research_pipeline(topic:str) -> dict:
    state={}

    #search agent
    print("\n"+" ="*50)
    print("Search Agent")
    print("="*50)

    search_agent=build_search_agent()
    search_result=search_agent.invoke({
        "messages": [("user",f"Find recent, reliable, and detailed information about: {topic}")]
    })
    state["search_results"]=search_result["messages"][-1].content
    
    print("\n Search Result\n", state['search_results'])

    #Reader agent
    print("\n"+" ="*50)
    print("Reader Agent")
    print("="*50)

    reader_agent=build_reader_agent()
    reader_result=reader_agent.invoke({
        "messages": [("user",
            f"Based on the following search results about '{topic}',"
            f"pick the most relevant URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_results'] [:800]}"
        )]
    })
    state['scraped_content']=reader_result['messages'][-1].content

    print("\nScraped content\n", state['scraped_content'])

    #Writer
    print("\n"+" ="*50)
    print("Writer is drafting a report")
    print("="*50)

    research_combined=(
        f"Search Results:\n {state['search_results']}\n\n"
        f"Detailed Scraped Content:\n {state['scraped_content']}"
    )

    state['report']=writer_chain.invoke({
        "topic": topic,
        "research": research_combined
    })

    print("\nFinal Report\n",state['report'])

    #critic
    print("\n"+" ="*50)
    print("Critic Agent")
    print("="*50)

    state['feedback']=critic_chain.invoke({
        "report": state['report']
    })

    print("\nCritic Report\n", state['feedback'])

    return state

if __name__=="__main__":
    topic=input("\nEnter a research topic: ")
    run_research_pipeline(topic)