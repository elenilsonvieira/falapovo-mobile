import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Definindo a interface para Comment
interface Comment {
  id: string;
  reportId: string;
  text: string;
  author: string;
  createdAt: string;
}

// Definindo a interface para Report
interface Report {
  id: number;
  message: string;
  category: string;
  location: string;
  createdAt: string;
  image: string;
  status: string;
  comments: Comment[];
}

let mockUsers = [
  { id: 'admin-01', name: 'Administrador', email: 'admin@falapovo.com', password: '123456', isAdmin: true }
];
let mockReports: Report[] = [
  { id: 1, message: 'Buraco enorme na Av. Principal', category: 'Buraco', location: 'Av. Principal, 123', createdAt: '17/07/2025', image: '', status: 'Recebido', comments: [] },
  { id: 2, message: 'Construção bloqueando a calçada', category: 'Obra', location: 'Rua Secundária, 456', createdAt: '16/07/2025', image: '', status: 'Recebido', comments: [] },
  { id: 3, message: 'Outro buraco perto da praça', category: 'Buraco', location: 'Praça Central', createdAt: '15/07/2025', image: '', status: 'Resolvido', comments: [] },
];
let mockComments: Comment[] = [];

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  console.log('Recebido pedido de registro para:', email);

  const existingUser = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: 'Email já está em uso' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    isAdmin: false,
  };

  mockUsers.push(newUser);
  console.log('Usuário registrado com sucesso:', newUser);
  console.log('Todos os usuários:', mockUsers);

  res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Pedido de login para:', email);

  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({
    message: 'Login bem-sucedido!',
    user: userWithoutPassword,
    token: 'fake-jwt-token-12345'
  });
});

app.get('/api/admin/reports', (req: Request, res: Response) => {
  console.log('Admin buscou todas as denúncias.');
  res.status(200).json(mockReports);
});

app.patch('/api/reports/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const reportIndex = mockReports.findIndex((r: Report) => r.id === parseInt(id));
  if (reportIndex > -1) {
    mockReports[reportIndex].status = status;
    console.log(`Status da denúncia ${id} atualizado para: ${status}`);
    res.status(200).json(mockReports[reportIndex]);
  } else {
    res.status(404).json({ message: 'Denúncia não encontrada.' });
  }
});

app.post('/api/reports/:reportId/comments', (req: Request, res: Response) => {
  const { reportId } = req.params;
  const { text, author } = req.body;

  if (!text || !author) {
    return res.status(400).json({ message: 'Texto e autor são obrigatórios' });
  }

  const report = mockReports.find((r: Report) => r.id === parseInt(reportId));
  if (!report) {
    return res.status(404).json({ message: 'Relato não encontrado' });
  }

  const comment: Comment = {
    id: `comment-${Date.now()}`,
    reportId,
    text,
    author,
    createdAt: new Date().toISOString(),
  };

  mockComments.push(comment);
  report.comments.push(comment);
  console.log(`Comentário adicionado ao relato ${reportId}:`, comment);

  res.status(201).json({ message: 'Comentário adicionado com sucesso!', comment });
});

app.get('/api/reports/:reportId/comments', (req: Request, res: Response) => {
  const { reportId } = req.params;
  const report = mockReports.find((r: Report) => r.id === parseInt(reportId));
  if (!report) {
    return res.status(404).json({ message: 'Relato não encontrado' });
  }
  res.status(200).json(report.comments);
});

app.listen(PORT, '0.0.0.0', () => {
  const networkIp = '10.213.57.42';
  console.log(`🎉 Servidor da API rodando em http://localhost:${PORT}`);
  console.log(`🚀 Acessível na rede em http://${networkIp}:${PORT}`);
});