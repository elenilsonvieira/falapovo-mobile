import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';


const app = express();
const PORT = 3000; 


app.use(cors()); 
app.use(bodyParser.json()); 

// --- ENDPOINTS (ROTAS) DA API ---


app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  console.log('Recebido pedido de registro para:');
  console.log('Nome:', name);
  console.log('Email:', email);



  //  (simulação)
  if (email === 'usado@email.com') {
    return res.status(400).json({ message: 'Email já está em uso' });
  }

 
  res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});


app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log('Recebido pedido de login para:');
  console.log('Email:', email);

  
  if (password === '123456') {
    
    res.status(200).json({
      message: 'Login bem-sucedido!',
      user: {
        id: '123',
        name: 'Usuário de Teste',
        email: email,
      },
      token: 'fake-jwt-token-12345'
    });
  } else {
    
    res.status(401).json({ message: 'Email ou senha inválidos' });
  }
});

// --- INICIA O SERVIDOR ---


app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 Servidor da API rodando em http://localhost:${PORT}`);
  console.log(`🚀 Acessível na rede em http://10.19.243.42:${PORT}`);
});
