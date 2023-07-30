---
title: Serverless vs cloud vs server
pubDate: 2020-12-06
tags:
  - Backend
description: Is serverless a fad or future? Should I use serverless or cloud, or even my own server? What does big companies do?
---

On one of my side projects built on firebase + react, we are discussing if/when we should move to our own server. So I thought why not write down my thought around this topic.

## Run down of serverless, cloud, and server

"Serverless" and "Cloud" are considered buzz-words in some cases, and "server" may mean different things in different senario. And the boundaries between them are blury, let me try to write my understanding (I lost myself when trying to write them down)

| Type                   | Hardware                                        | Software                                          | Note                               |
|------------------------|-------------------------------------------------|---------------------------------------------------|------------------------------------|
| Data center            | Everything, from the building to machines       | ssh, then build everything from scratch           | Only big companies use this        |
| Physical machine       | Own a physical computer and keep it on 24/7     | ssh, then build everything from scratch           | An outdated setup                  |
| VPS                    | Pay monthly fee to have it handled by providers | ssh, then build everything from scratch           | Becoming less common/hot           |
| "heavy" cloud platforms | Pay for each service                            | Pick the service, then follow their documentation | Common among mid-size companies    |
| "Neat" cloud platforms | Pay for each service                            | Pick the service, then follow their documentation | Common for small-mid size projects |

The list is not named "cloud" "serverless", rather it's a list that starts from "server", then gradually blur into "cloud", then "serverless".
From top to bottom, you have less and less to worry about, so your development efficiency is higher. But you also lose some flexibility, as well as unit-price is higher (generally speaking).

### Data center

The most hard-core type of server(s). Only big companies has them, either use by themselves, or more commonly provide them as a service (like Google Cloud / AWS).

The owner needs to handle everything - both software and hardwere, even including how to cool down the building, how to find the land to build the building!

### Physical computer

A computer sitting in the office/home: the old-school, and rarely used in real world now. You just serve your backend on a port (usually 80 - HTTP and 443 - HTTPS).

The developer needs to handle both the hardware and software - you need to buy a physical computer, and keep it connected to power and Internet all the time. Then build you website on it.

### VPS (Virtual private server)

This is very similar to the "Physical computer" above. It's still a machine, or part of a virtual machines, the difference is this is sitting in provider's data center. So compare to above, you only need to handle the "software" part, not the "hardware" part - you pay a monthly fee to have it managed by the provider. One example product is [linode.com](https://linode.com), and most cloud providers provide this service.

You can just `ssh` into the machine, and use it just like your own computer. And it serves by opening a port as well.

This starts to blur into *"Cloud"*. Some VPS call them "Cloud hosting". And many cloud platforms provides VPS as a product as well. And VPS only services are becoming less common (at least less "hot") recently, as you still need to do all the software work yourself - install database, handle security, handle hosting.

### "heavy" Cloud platform

This is a tricky one to define, but I'll just throw out the examples - AWS, GCP, Azure, Alibaba Cloud. It's hard to define, because it is not a specific technology, but all a suite of products that covers under one company/brand name. They usually provide some hosting, database, storage, and a lot lot more products in one platform, in many cases also includes VPS, and "serverless" products.

When using cloud platforms, you have all the services set up for you, you don't need to install MySQL or MongoDB to have a database, you just go to GCP/AWS website, turn it on, and start to use it. And you have many security safeguards, global distribution and scalability, best practices, etc. come with it for free/for a fee.

### "Neat" Cloud platform

In my mind, this category is usually considered the broader "serverless". The term "serverless" is not meaningful. There are still servers, just that developers don't need to worry about them, because the server is "in the cloud" - which... just means "serverless" just a fancy word for "cloud". I feel heavy and heavy (and usually older) cloud platforms call themselves "cloud", and neat, more friendly, (and usually newer) cloud services call themselves "serverless". (But, there's no need to fight over what the name is/means...)

This category covers products/services like Firebase (Part of Google Cloud), AWS Amplify.

A common theme is: most "heavy" cloud platforms are more backend-friendly, and most "neat" cloud platforms are frontend-friendly. For example, Firebase and GCP are both provided by Google, and even shares may backend internally, but for the same Storage feature, GCP is backend-first (Integration using C++, Java, Python, etc. [documentation](https://cloud.google.com/storage/docs/reference/libraries)), while Firebase Storage is frontend-first (Web, Android, iOS [documentation](https://firebase.google.com/docs/storage)).

## Why should I use serverless/cloud?

### Instantly get full backend features without writing a line of backend code

First of all, I love to use Firebase. So I might be biased. The biggest convenience for me is that I can have auth, database, storage, hosting, apis, without maintain them my own. Here's an example of steps:

1. Create a project from firebase website. And copy the config json object.
1. `npm i firebase`
1. In my code, import the firebase package, then `firebase.initializeApp(CONFIG_JSON);`
1. Start to use `firebase.database()`, `firebase.auth()`, `firebase.storage()`
1. And your app can be deployed to Firebase Hosting by one single command `firebase deploy`

That's it, just with 2 lines of code, you have an auth system (supports email, anomymous, Google, Twitter, Facebook, etc.), a databases, a storage, and more. And everything can be used easily in your front end code. No need to write a single line of backend code.

### Powerful cloud functions

IIRC, cloud functions are what brought the word "serverless" to the world. And many services provides it - Netlify, AWS Lambda, Firebase, and many more.

Use Firebase Functions as an example again:
```js
exports.myApi = functions.https.onRequest(async (req, res) => {
  // This is identical to a Express server route, you can do whatever you need.
})

exports.scheduledFunctionCrontab = functions.pubsub.schedule('05 * * * *').onRun(async () => {
  // A scheduled cron job
})

/* Firebase also provides triggers integrated with other Firebase services */

exports.newUserProcess = functions.database.ref('/user/{userId}').onCreate((snapshot, context) => {
  // This runs whenever a new user entry is added to your database path
})

exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  // This runs whenever a file is uploaded. You can auto resize image, backup file, etc.
});
```

Those usually requires you have a real backend. But with Cloud Functions, you just write it locally and `firebase deploy`. And you get your APIs, CRON jobs, auto processing conveniently.

## How to decide what to use?

From data center, physical machine, to cloud services - how should I decide what to use? It depends on your needs. And it's a tradeoff between price, flexibility and engineering resources you have.

### Pricing

Cloud platforms (both "heavy" and "neat") usually starts from a free quota, then charge for usage. For example, the project I'm working on using Firebase was under free quota when we had a few hundreds users. Once we grew to ~2000 users, we hit quota for storage and hosting traffic, and our last month Firebase bill was ~$10.

In comparison, my personal server on Linode is $5 a month. I can host far more content than we have in Firebase before the traffic get throttled. But it also means I need to code and maintain everything myself.

### Flexibility

Since cloud services are set up by providers, you can only use what is provided. If what you want is not there, you have to find it from other providers. Not like your own server, you can install whatever software you want to use.

### Engineering resources

It's needless to say, serverless and cloud are convenient - and that's one big reason why it's so popular! If you are a one person team, and you have a brilliant product idea, do you want to spend a week to set up database, site hosting, security, etc.? Or just hit "create a new project" in Firebase/AWS get everything set up for you instantly?  

## Final words

There's no absolute right choice, you need to weight the pros and cons of each option for each of your projects.

One thing prompted me to think about this whole article is how deep the infrastructure at Google is - we have almost everything built internally. We use our own version control system instead of git, because git just doesn't work well for the size of our codebase. We have all the code review, compiling, testing, deploying, monitoring services internally, so they are all integrated closely. And of course we build our own data centers, even the servers, and TPU to serve the needs.

This is the tradeoff Google made - use a huge amount of engineering resources and up-front investment to build and own the whole process from hardware to software, make it fit with each other. This is definitely one extreme of the spectrum. And depending on the need/resources/budget of your project, you can find the sweet spot in the whole spectrum for your project!
