const questions = [
    {
      question: "What is the purpose of a constructor in object-oriented programming?",
      options: [
        "To initialize an object when it is created.",
        "To destroy objects once they are no longer needed.",
        "To define the behavior of an object after it is created.",
        "To allow inheritance between classes."
      ],
      correctAnswer: "To initialize an object when it is created."
    },
    {
      question: "What is encapsulation in OOP?",
      options: [
        "The process of creating multiple instances of a class",
        "The bundling of data and the methods that operate on that data within a single unit",
        "The ability of a class to inherit from another class",
        "The process of converting complex data types to primitive data types"
      ],
      correctAnswer: "The bundling of data and the methods that operate on that data within a single unit"
    },
    {
      question: "What is polymorphism in OOP?",
      options: [
        "The ability to create multiple classes with the same name",
        "The ability to define methods in a parent class and override them in derived classes",
        "The bundling of data and methods into a single unit",
        "The process of inheriting properties and methods from another class"
      ],
      correctAnswer: "The ability to define methods in a parent class and override them in derived classes"
    },
    {
      question: "What is inheritance in OOP?",
      options: [
        "The process of converting data types to objects",
        "The ability of one class to derive properties and methods from another class",
        "The process of defining a class within another class",
        "The ability of a method to call itself"
      ],
      correctAnswer: "The ability of one class to derive properties and methods from another class"
    },
    {
      question: "What does the 'this' keyword refer to in a class?",
      options: [
        "A global object",
        "The current instance of the class",
        "The parent class of the current class",
        "A static method within the class"
      ],
      correctAnswer: "The current instance of the class"
    },
    {
      question: "What is an abstract class in OOP?",
      options: [
        "A class that cannot have methods",
        "A class that cannot be instantiated and is intended to be subclassed",
        "A class that can only have static methods",
        "A class that automatically inherits from all other classes"
      ],
      correctAnswer: "A class that cannot be instantiated and is intended to be subclassed"
    },
    {
      question: "What is the difference between a class and an object?",
      options: [
        "A class is an instance of an object, while an object defines a class.",
        "A class is a blueprint for creating objects, while an object is an instance of a class.",
        "A class contains data, while an object contains methods.",
        "There is no difference; the terms are interchangeable."
      ],
      correctAnswer: "A class is a blueprint for creating objects, while an object is an instance of a class."
    },
    {
      question: "What is method overloading?",
      options: [
        "Defining multiple methods with the same name but different parameters in the same class",
        "Defining multiple classes with the same methods",
        "Overriding a method in a parent class with a method in a child class",
        "Creating methods that call other methods"
      ],
      correctAnswer: "Defining multiple methods with the same name but different parameters in the same class"
    },
    {
      question: "What is the difference between public and private access modifiers?",
      options: [
        "Public members are accessible from outside the class, while private members are accessible only within the class.",
        "Public members are faster, while private members are slower.",
        "Public members are static, while private members are non-static.",
        "Public members are for methods, while private members are for properties."
      ],
      correctAnswer: "Public members are accessible from outside the class, while private members are accessible only within the class."
    },
    {
      question: "What is an interface in OOP?",
      options: [
        "A class that contains only private methods and properties",
        "A type of class that provides full implementation for methods",
        "A blueprint for a class that contains method signatures without implementation",
        "A feature that allows dynamic memory allocation"
      ],
      correctAnswer: "A blueprint for a class that contains method signatures without implementation"
    }
  ];
  
  console.log('Exporting questions:', questions.length);
  export default questions;
  