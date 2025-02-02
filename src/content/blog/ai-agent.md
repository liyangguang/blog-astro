---
title: AI Agent. what is it, how to build it
pubDate: 2025-02-01
tags:
  - LLM / GPT
description: LLM, function calls, tools, agents - A brief introduction of what's the relationship among them.
isFeatured: true
---

**AI Agents** has getting more popular recently, and especially with [OpenAI's Operator](https://openai.com/index/introducing-operator/). I'll talk briefly about what it is, and how it's related to other similar concepts, finally, how to build one.

## TLRD

|  | Structured function calling | Execute functions | Function runs on | Iterative running |
|--| --- | --- | --- | --- |
| Directly LLM | ⛔️ | ⛔️ | ⛔️ | ⛔️ |
| Function call | ✅ | ⛔️ | ⛔️ | ⛔️ |
| Built-in tools | ✅ | ✅ | The platform | ⛔️ |
| Plugin | ✅ | ✅ | Developer's server | ⛔️ |
| Agent | ✅ | ✅ | Developer's server | ✅ |

Keep reading to understand each of them in detail!

## Related / prior concepts before agents

There might be different names ppl/companies use for these concepts, so let me clarify what I'm talking about first.

- First of all, I'm talking about these concepts in the context of LLM.
- None of these are "brand new" technology. Those are ways to *use* LLM (with caveats, will discuss later).
- These are all relatd - mostly one bulit on top of another, I'll go over them from basic to complex.

### LLM

I assume you are already familiar with LLM. If not, check out [LLM for web developers - basic concepts](../gpt-overview) and [LLM for web developers - coding](../openai-api).

```
Human: How to make a taco?

AI: To make a taco, first ...
```

### Function calls / tools

```js
// The "old" way to use function calls

// Human:
`I have a functions `getTemperture(cityName: string): Promise<number>`.
If any function can be helpful to answer my question, use it in your reply,
and in a format like "function name [parameter list]".

What's the temperture of the capital city of China?`

// AI:
"getTemperture ['Beijing']"
```

You explain what function is available, and how to use them. Then a question. LLM will try to use them in the context of the question. But, if you ever worked with function calls in this way, you will know it's *very unreliable* - usage of it, format of it, etc.

Then, it comes to "function calls" in LLM APIs, like [OpenAI's](https://platform.openai.com/docs/guides/function-calling).

```js
// The new way to use function calls (Simplified sudo API code)

{ // Human
  tools: [{
    name: "getTemperture", arguments: ["citiName": "string"],
    description: "get the temperture of a city",
  }],
  message: "What's the temperture of the capital city of China?"
}

{ // AI
  function: {"getTemperture": ["Beijing"]}
}
```

You can see the difference is mostly a more structured way to give function definitions, and get formatted output. In my understanding - this is achieved by "tuning" the LLM that follow the function definition and format better. And provide a better API developer experience.

But, this **doesn't execute any code**. You simply get the text string of `"getTemperture", "Beijing"`. And to use it, you need to run it yourself (or, in most cases, use an agent. See below).

### Built-in tools with execution

Most LLM platforms (OpenAI, Gemini) provides some "built-in" tools, that can be executed - most common tools are **web search / browser**.

Let's take one step back, and say we don't have built-in tools. A Google search using a function would be:

```js
// A normal tool example of search

{ // Human
  tools: [{
    name: "googleApiSearch", arguments: ["query": "string"],
    description: "get a list of results for a Google search",
  }],
  message: "What's score of today's NBA games?"
}

{ // AI
  function: {"googleApiSearch": ["NBA results"]}
}
```

Then you would call the API yourself. The **Built-in tools with execution** is basically that the platform (OpenAI/Google/etc) defines the tool, and execute it on their backend, and pass the result of the tool execution back to LLM, then get another response back to you.

The flow looks like this:

![Tool exeuciton](@assets/agent/tool-execution.png)

And from user's experience, the tool and execution are "hidden".

```js
// Tool with execution by the platform

{ // Human
  message: "What's score of today's NBA games?",
  tools: {search: true},
}

// AI
"There are two games today. Warriors @ Spurs ended with 100:90, and Heat lost against Suns with 90:99."
```

### ChatGPT Plugin

OpenAI has this [Plugin](https://openai.com/index/chatgpt-plugins/) feature, and a marketplace for public plugins.

This is essentially a tool with execution. With the difference that the execution is owned by a third-party developer, not the platform.

![plugin](@assets/agent/plugin.png)

## Agent

### Flow overview

All the features so far are just one round of request. Agent is built on top of it, with another LLM that (1) plans the work, (2) execute functions, (3) iterates.

There's no special LLM tech for this (yet), it's simply using LLM. Here's a skeleton of a agent.

![agent](@assets/agent/agent.png)

### Implementation example

The agent is 
```js
// The agent
function createLlmRequest(message) {
  conversation.push(message);
  await llmService.request({
    system: `
      For user's request, you should make a plan to get the final answer,
      utlizing available tools if needed.
      When finished, end the message with [END].`
    tools: [
      {name: 'runSql', arguments: {query: 'string'}, description: 'run a SQL query'},
      {name: 'downloadFile', arguments: {url: 'string'}, description: 'download a file'},
    ],
    messages: conversation,
  })
}
```

```js
// tool execution
function handleFunctionCalls(functionResponse) {
  switch (functionResponse.name) {
    case 'runSql':
      return await sqlService.query(functionResponse.arguments.query);
    case 'downloadFile':
      return await awsService.s3.download(functionResponse.arguments.url);
  }
}
```


```js
// The flow (sudo code, simplified)

function step(newQuery) {
  const response = await createLlmRequest(newQuery).
  // If we got the final answer, return;
  if (response.text.endWith('[END]')) {
    return response.text;
  }
  if (runCount > limit) {
    return 'sorry, no answer found';
  }

  if (response.function) {
    const functionResponse = await handleFunctionCalls(response.function);
    return step(functionResponse);
  } else {
    return step(response.text)
  }
}
```

And let's see how it works:

1. Human: `downlaod profile photo of user 123`.
1. Agent combines the query, and tools, and send to LLM.
1. Possible LLM response:
    ```
    To download the profile photo of 123 with given tools, I can:
    1. Find out table schema
    2. Find the profile photo URL in the table
    3. Download it
    --- (functions part of the response)
    runSql, "describe users"
    ```
1. Agent receives the function call response, executes it, returns `... id, ... profile_url, ...`
1. Agent send this info, together with the chat history/plan back to LLM
1. Possible LLM response: "I see the table columns, now I can query that user. runSql, "select profile_url from users where id = '123'""
1. Agent receives the new function call, executes it, returns `profile_url: https://...`. Send back to LLM with the conversation.
1. LLM response: `downloadFile, "https://..."`
1. Agent downloads file, send return value (assuming a file path) and conversation back to LLM.
1. LLM response: `The file is downloaded at path ..., [END]`
1. Agent receives end signal reply back to user.

That's it! Agent just iteratively runs LLM, execute tools, and get to the final answer.

### Agent using Tools

The power and use case of agents depends a lot on what tools you provide. And there is no limit to the type of tools:

- Making external requests like calling APIs.
- Control browser (headless or with UI) like a human (like what OpenAI Operator does)
- Execute commands in terminal
- Interact with user, ask for input from the user.
- and on and on.

With all those different tools and combination of tools, you can build agents for many use cases. Almost all the task you can do on a computer, can be done via an agent with proper tools.

- **AI developer**: web browse (read docs) + file system access (read/write code) + devserver run and control.
- **HR admin**: SAP system use + Workday system use, etc.
- **Travel planner**: web browse (read travel guides) + flight search and booking + calendar integration
- **Comic book maker**: stroy writer + image generation model

But, there're also many issues and considerations:

- **Reliability**: With the tasks being more broad, the agent will be less reliable. It may not plan the job well, or not using tools properly.
- **Stuck in the process**: Another common issue is agent can keep repeating a few steps and cannot figure out how to move forward.
- **Security**: When you give agent access to some tools like full browser control, terminal control, etc. there's the risk of it doing unexpected actions.

### Agent planning

In real use cases, to make the agent work more reliably, many brilliant minds came up with useful prompt instructions.

Here is one example from [langchain's agent](https://github.com/langchain-ai/langchainjs/blob/main/langchain/src/agents/mrkl/prompt.ts):

```js
export const PREFIX = `Answer the following questions as best you can. You have access to the following tools:`;
export const FORMAT_INSTRUCTIONS = `Use the following format in your response:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question`;
export const SUFFIX = `Begin!

Question: {input}
Thought:{agent_scratchpad}`;
```

It's more structured, and provides clear guidence on how to make a plan, and follow it to get to the end result.

It's the art of prompt engineering, and many many techniques to improve it. I won't expand too much here.

## Overall comparison

|  | Structured function calling | Execute functions | Function runs on | Iterative running |
|--| --- | --- | --- | --- |
| Directly LLM | ⛔️ | ⛔️ | ⛔️ | ⛔️ |
| Function call | ✅ | ⛔️ | ⛔️ | ⛔️ |
| Built-in tools | ✅ | ✅ | The platform | ⛔️ |
| Plugin | ✅ | ✅ | Developer's server | ⛔️ |
| Agent | ✅ | ✅ | Developer's server | ✅ |
