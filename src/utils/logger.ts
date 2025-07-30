interface LogData {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package: 'cache' | 'controller' | 'database' | 'domain' | 'handler' | 'repository' | 'component' | 'service' | 'utils';
  message: string;
}

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMnBhMWExMjg1QHZpc2hudS5lZHUuaW4iLCJleHAiOjE3NTM4NTQ4OTUsImlhdCI6MTc1Mzg1Mzk5NSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImYyMDUyODZiLTRkODAtNDUyOC1hYjQ0LWJmZDMzMjhiYjczZiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImtvdGEgc2FpIHJvaGl0aCIsInN1YiI6IjgyMWI0ZTFjLWIwMDQtNDZlZC04MDk2LTVkMGM4OTUyMmU1NSJ9LCJlbWFpbCI6IjIycGExYTEyODVAdmlzaG51LmVkdS5pbiIsIm5hbWUiOiJrb3RhIHNhaSByb2hpdGgiLCJyb2xsTm8iOiIyMnBhMWExMjg1IiwiYWNjZXNzQ29kZSI6InF4Uk13cSIsImNsaWVudElEIjoiODIxYjRlMWMtYjAwNC00NmVkLTgwOTYtNWQwYzg5NTIyZTU1IiwiY2xpZW50U2VjcmV0IjoieUVzbnJjeUhacHBXdmdlVCJ9.LyqobwDCyRF2JSm8y0nvAFFSHmY0Vy_a4fgFvKt9zI8";

export const log = async (stack: LogData['stack'], level: LogData['level'], packageName: LogData['package'], message: string): Promise<void> => {
  try {
    const logData: LogData = {
      stack,
      level,
      package: packageName,
      message
    };

    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(logData)
    });

    if (!response.ok) {
      console.error('Logging failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Logging error:', error);
  }
}; 