from flask import Flask, render_template, request, redirect, url_for, flash, session,jsonify
import sqlite3

app = Flask(__name__)
app.secret_key = 'supersecretkey'

def conexcao():
    conexcao = sqlite3.connect('sistema.db')
    return conexcao

def criar_tabela(conexao):
    cursor = conexao.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cadastro (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            saldo REAL DEFAULT 0.0 
        )
    ''')
    conexao.commit()

def recuperar_saldo(conexao, nome_usuario):
    cursor = conexao.cursor()
    cursor.execute('SELECT saldo FROM cadastro WHERE nome = ?', (nome_usuario,))
    row = cursor.fetchone()
    return row[0] if row else 0.0

def atualizar_saldo(conexao, nome_usuario, novo_saldo):
    cursor = conexao.cursor()
    cursor.execute('UPDATE cadastro SET saldo = ? WHERE nome = ?', (novo_saldo, nome_usuario))
    conexao.commit()

def cadastrar_usuario(conexao, nome, senha):
    cursor = conexao.cursor()
    try:
        cursor.execute('INSERT INTO cadastro (nome, senha, saldo) VALUES (?, ?, ?)', (nome, senha, 0.0))
        conexao.commit()
        return True
    except sqlite3.IntegrityError:
        return False

def logar_usuario(conexao, nome, senha):
    cursor = conexao.cursor()
    cursor.execute('''SELECT * FROM cadastro WHERE nome = ? AND senha = ?''', (nome, senha))
    return cursor.fetchone()

def deletar_usuario(conexao, nome):
    cursor = conexao.cursor()
    cursor.execute('''
        DELETE FROM cadastro WHERE nome = ?''', (nome,)) # deleta usuario
    conexao.commit()  # Confirma a transação
    return cursor.rowcount > 0


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cadastro',methods=['GET','POST'])
def cadastro():
     if request.method == 'POST':
        nome = request.form['nome']
        senha = request.form['senha']
        conexao = conexcao()
        criar_tabela(conexao)
        if cadastrar_usuario(conexao, nome, senha):
            flash('Usuário cadastrado com sucesso!', 'success')
            return redirect(url_for('login'))
        else:
            flash('Usuário já cadastrado.', 'Aviso')
     return render_template('cadastro.html')



@app.route('/login', methods=['GET', 'POST'])
def login():
     if request.method == 'POST':
        nome = request.form['nome']
        senha = request.form['senha']
        conexao = conexcao()
        resultado = logar_usuario(conexao, nome, senha)
        if resultado:
            session['usuario_logado'] = nome
            flash('Login realizado com sucesso!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Nome ou senha incorretos.', 'Aviso')
     return render_template('login.html')




if __name__ == '__main__':
    conexao = conexcao()
    criar_tabela(conexao)
    app.run(debug=True)
