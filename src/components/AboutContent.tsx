// import React from 'react'

const AboutContent = () => {
  return (
    <article className="container mx-auto px-4 py-10 text-left">
      <h3 className="font-mono text-3xl font-bold text-gray-200 mb-4">
        About LLMChat
      </h3>
      <p className="text-lg font-mono text-gray-300">
        LLMChat is a simple web application built to experiment with the
        capabilities of large language models (LLMs). This project serves as a
        playground to explore the potential of large language models and their
        applications.
      </p>
      <p className="text-lg font-mono text-gray-600 mt-4">
        The frontend is developed using ReactJS, while the backend utilizes
        Node.js-esk Bun & ExpressJS to handle interactions with the LLM via
        restful APIs
      </p>
      <p className="text-lg font-mono text-gray-600 mt-4">
        Feel free to explore the application and provide feedback.
      </p>
    </article>
  );
};

export default AboutContent;
