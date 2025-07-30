const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMnBhMWExMjc1QHZpc2hudS5lZHUuaW4iLCJleHAiOjE3NTM4NTQ5MDAsImlhdCI6MTc1Mzg1NDAwMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijg2ZGJkNjQ1LTVkYzEtNDI0Yi1iMzNiLTgxOWU5MGFjMTU1NSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImthdnVydSBkZXZha2VlbmFuZGEgc2F0eWEgc2FpIHNpZGRhcmRoYSIsInN1YiI6IjMwMTUxZWY4LTViNTctNGZlNy05NmZkLTk3MGIzNzI1NmM3ZSJ9LCJlbWFpbCI6IjIycGExYTEyNzVAdmlzaG51LmVkdS5pbiIsIm5hbWUiOiJrYXZ1cnUgZGV2YWtlZW5hbmRhIHNhdHlhIHNhaSBzaWRkYXJkaGEiLCJyb2xsTm8iOiIyMnBhMWExMjc1IiwiYWNjZXNzQ29kZSI6InF4Uk13cSIsImNsaWVudElEIjoiMzAxNTFlZjgtNWI1Ny00ZmU3LTk2ZmQtOTcwYjM3MjU2YzdlIiwiY2xpZW50U2VjcmV0IjoiVnNXVGFTeVNBVnN6RFJhQyJ9.4-k90cZiwqpP6_xpiei2Aqh2bANbBZs-WYWviPE6Bq8";

const log = async (stack, level, packageName, message) => {
  try {
    const logData = {
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

module.exports = { log }; 