**--ONGOING--**
<h1>InsuranSure: The All-in-One Insurance Premium Estimator 🛡️ </h1>

**InsuranSure is a full-stack, microservices-based web application designed to demystify insurance costs. It provides users with instant, data-driven estimates for various insurance premiums, starting with medical insurance and expanding to other domains.**

This project is not just a prediction tool; it's a complete end-to-end demonstration of a modern web application, integrating a machine learning backend with a robust web interface.

<h2>✨ Features</h2>

**⦿ Multi-Linear Regression Model:** Utilizes a carefully trained model to predict medical insurance premiums based on key user inputs.

**⦿ RESTful API Architecture:** Built with a decoupled frontend and backend, featuring a Node.js gateway that communicates with a Python/Flask ML microservice.

**⦿ Interactive UI:** A clean, responsive, and user-friendly interface built with React that allows for seamless data entry and clear presentation of results.

**⦿ "What If" Scenarios:** Instantly see how changes in lifestyle or demographics (e.g., quitting smoking) can affect your estimated premium.

**⦿ (Planned) User Accounts:** Secure user authentication (JWT) to save prediction history and track estimates over time.

**⦿ (Planned) Multi-Insurance Support:** A scalable architecture ready to incorporate models for car, life, and home insurance.

<h2>🏛️ System Architecture</h2>

This project is built using a **microservice architecture** to ensure separation of concerns, scalability, and maintainability.

**⦿ Frontend (React):** The client-side application that users interact with. It is responsible for capturing user input and displaying results. It only communicates with the Backend Gateway.

**⦿ Backend Gateway (Node.js/Express):** The central hub of the application. It handles core business logic, user authentication, and acts as a single point of contact for the frontend. It forwards ML-specific requests to the appropriate microservice.

**⦿ ML Microservice (Python/Flask):** A dedicated, lightweight service whose sole responsibility is to serve predictions from the trained machine learning model via a REST API.

<h2>📈 Project Roadmap</h2>

⦿ [x] Develop and train the core Medical Insurance Prediction model.

⦿ [x] Build the Python/Flask microservice for the model.

⦿ [x] Set up the Node.js gateway and connect it to the Flask service.

⦿ [ ] Develop the complete React user interface.

⦿ [ ] Implement JWT-based user authentication and database integration.

⦿ [ ] Add a "Prediction History" feature for logged-in users.

⦿ [ ] Research and integrate a Car Insurance Prediction model.

⦿ [ ] Research and integrate a Life Insurance Prediction model.

⦿ [ ] Containerize the application with Docker for easier deployment.
