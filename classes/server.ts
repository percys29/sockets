//importando libreria express
import express from 'express';
import { SERVER_PORT } from '../globals/environment';
import http from 'http';
import socketIO from 'socket.io';
import { UsuariosLista } from './usuario-lista';
import { Usuario } from './usuario';

//creando la clase del servidor
export default class Server{

    //creando la variable del servidor express
    public app:express.Application;
    public port:Number;
    private httpServer:http.Server;
    public io:socketIO.Server;
    public usuariosConectados = new UsuariosLista();
    //constructor del Server
    constructor(){
        this.app = express();
        this.port = SERVER_PORT;
        //configurando el nuevo servidor web a través de http
        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        this.escucharSockets();
    }
    //Programador getter de la unica instancia de la clase
    //(patron de Diseño SINGLETON)
    private static _instance:Server;
    public static get instance(){
        if(this._instance){
            return this._instance;
        }else{
            this._instance = new this();
            return this._instance
        }
    }
    //funcion para escuchar las conexiones
    public escucharSockets(){
        console.log("Listo para recibir conexiones o sockets o clientes");
        //el servidor escucha el evento connect y recibe al cliente conectado
        this.io.on('connect',cliente=>{
            console.log("Nuevo cliente conectado", cliente.id);
            const usuario = new Usuario(cliente.id);
            this.usuariosConectados.agregar(usuario);


            //el cliente que se ha conectado previamente, escucha su desconexión
            cliente.on('disconnect',()=>{
                console.log("el cliente se ha desconectado");
                this.usuariosConectados.borrarUsuario(cliente.id);
                this.io.emit('usuarios-activos',this.usuariosConectados.getLista());
            });
            //el cliente que se ha conectado previamente, escucha un evento de nombre: 'mensaje'
            cliente.on('mensaje',(contenido)=>{
                console.log("entrada", contenido);
                this.io.emit('mensaje-nuevo', contenido);
            });
            cliente.on('configurar-usuario',(payload:any,callback:Function)=>{
                this.usuariosConectados.actualizarNombre(cliente.id,payload.nombre);
                this.io.emit('usuarios-activos',this.usuariosConectados.getLista());
                callback({
                    ok:true,
                    mensaje:`Usuario ${payload.nombre} configurado`
                });
            });
            cliente.on('obtener-usuario',()=>{
                this.io.in(cliente.id).emit('usuarios-activos',this.usuariosConectados.getLista());
            });
        });
    }
    //funcion para iniciar el servidor
    public start(callback:Function){
        this.httpServer.listen(this.port,callback);
    }
}
