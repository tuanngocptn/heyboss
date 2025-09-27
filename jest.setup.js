import '@testing-library/jest-dom'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config({ path: '.env' })

// Override NODE_ENV for testing
process.env.NODE_ENV = 'test'