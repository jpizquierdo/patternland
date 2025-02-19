## Secret key generation
Generating a long, random secret key is crucial for security when using algorithms like HS256 in JWT. A strong key makes it difficult for attackers to guess or brute-force your secret.

Here's how you can generate a secure, random secret key:
```python
import secrets

# Generate a random 256-bit secret key (32 bytes)
secret_key = secrets.token_urlsafe(32)
print(secret_key)

```

## Acknowledgments
This project mainly uses the following technologies and resources (among others):
- **[FastAPI](https://fastapi.tiangolo.com/)**: A modern, fast (high-performance), web framework for building APIs with Python based on standard Python type hints.
- **[Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template)**: A full-stack FastAPI template that inspired the initial development of this project and played a key role in my learning journey with FastAPI.
- **[SQLModel](https://sqlmodel.tiangolo.com/)**: A modern Python library for interacting with databases, combining SQLAlchemy and Pydantic into one easy-to-use library.
  - **[SQLAlchemy](https://www.sqlalchemy.org/)**: The core database toolkit and ORM used by SQLModel under the hood for handling database sessions and migrations.
  - **[Pydantic](https://docs.pydantic.dev/latest//)**: Data validation and settings management using Python type annotations. Pydantic is integrated with SQLModel to simplify model validation.


Special thanks to all contributors of these open-source projects and all the libraries which are in use!

## License

This project is licensed under the terms of the [MIT License](LICENSE).