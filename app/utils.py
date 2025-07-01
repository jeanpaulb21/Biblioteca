from itsdangerous import URLSafeTimedSerializer
from flask import current_app
import random
from app.models import Usuario
from flask import make_response
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
import io
import os

def generar_reporte_con_plantilla(atrasados):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # 🥑 1) Fondo con plantilla base
    c.drawImage("static/imagenes/plantilla.png", 0, 0, width=width, height=height)

    # 📝 2) Título extra si quieres
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, height - 180, "Reporte de Libros Atrasados")

    # 🗂️ 3) Datos tabla
    data = [["#", "Libro", "Usuario", "Fecha Vencida"]]
    for idx, p in enumerate(atrasados, start=1):
        data.append([
            str(idx),
            p.libro.titulo,
            p.usuario.correo,
            p.fecha_devolucion.strftime('%Y-%m-%d')
        ])

    # 🗃️ 4) Construir tabla con platypus
    table = Table(data, colWidths=[40, 200, 150, 100])
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgreen),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),

        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),

        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.gray)
    ])
    table.setStyle(style)

    # 🗂️ 5) Dibujar tabla en posición deseada
    table.wrapOn(c, width, height)
    table.drawOn(c, 40, height - 400)

    c.save()

    pdf = buffer.getvalue()
    buffer.close()
    return pdf

def generar_reporte_prestados(prestados):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # 🥑 Fondo plantilla
    ruta = os.path.join(os.getcwd(), 'static', 'imagenes', 'plantilla.png')
    c.drawImage(ruta, 0, 0, width=width, height=height)

    # 📝 Título
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, height - 180, "Reporte de Libros Más Prestados")

    # 🗂️ Datos tabla
    data = [["#", "Título", "Autor", "Total Préstamos"]]
    for idx, libro in enumerate(prestados, start=1):
        data.append([
            str(idx),
            libro.titulo,
            libro.autor,
            str(libro.total)
        ])

    # 🗃️ Tabla bonita
    table = Table(data, colWidths=[40, 200, 150, 100])
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgreen),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),

        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),

        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.gray)
    ])
    table.setStyle(style)

    # 🖼️ Dibujar tabla
    table.wrapOn(c, width, height)
    table.drawOn(c, 40, height - 400)

    c.save()
    pdf = buffer.getvalue()
    buffer.close()
    return pdf


def generar_reporte_populares(populares):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # 🥑 Fondo plantilla
    ruta = os.path.join(os.getcwd(), 'static', 'imagenes', 'plantilla.png')
    c.drawImage(ruta, 0, 0, width=width, height=height)

    # 📝 Título
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, height - 180, "Reporte de Libros Populares")

    # 🗂️ Datos tabla
    data = [["#", "Título", "Autor", "Total Reservas"]]
    for idx, libro in enumerate(populares, start=1):
        data.append([
            str(idx),
            libro.titulo,
            libro.autor,
            str(libro.total)
        ])

    # 🗃️ Tabla con estilo
    table = Table(data, colWidths=[40, 200, 150, 100])
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgreen),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),

        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),

        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.gray)
    ])
    table.setStyle(style)

    # 🖼️ Dibujar tabla
    table.wrapOn(c, width, height)
    table.drawOn(c, 40, height - 400)

    c.showPage() 
    c.save()
    pdf = buffer.getvalue()
    buffer.close()
    return pdf


def generar_token(email):
    serializer = URLSafeTimedSerializer(current_app.secret_key)
    return serializer.dumps(email, salt='recuperar-contrasena')

def verificar_token(token, max_age=3600):
    serializer = URLSafeTimedSerializer(current_app.secret_key)
    try:
        email = serializer.loads(token, salt='recuperar-contrasena', max_age=max_age)
    except:
        return None
    return email

def generar_llave_prestamo():
    while True:
        nueva_llave = f"{random.randint(100, 999)}-{random.randint(100, 999)}"
        if not Usuario.query.filter_by(llave_prestamo=nueva_llave).first():
            return nueva_llave

