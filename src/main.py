from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import MySQLdb.cursors
import MySQLdb.cursors, re, hashlib

app = Flask(__name__)
app.secret_key = 'sh9s5dj53nnv9450sdd'

app.config['MYSQL_HOST'] = '***REMOVED***'
app.config['MYSQL_USER'] = '***REMOVED***'
app.config['MYSQL_PASSWORD'] = '***REMOVED***'
app.config['MYSQL_DB'] = '***REMOVED***'

mysql = MySQL(app)

@app.route('/Sale Tracker v2/', methods = ['GET', 'POST'])
def login():
    msg = ''

    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        password = request.form['password']

        hash = password + app.secret_key
        hash = hashlib.sha1(hash.encode())
        password = hash.hexdigest()

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM accounts WHERE username = %s AND password = %s')

        account = cursor.fetchone()

        if account:
            session['loggedin'] = True
            session['id'] = account['id']
            session['username'] = account['username']

            return 'Logged in succesfully'
        else:
            msg = 'Incorrect username or password'

    return render_template('login.html', msg = msg)    