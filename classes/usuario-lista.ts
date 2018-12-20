import { Usuario } from './usuario';

export class UsuariosLista{
	private lista:Usuario[] = [];
	constructor(){}

	public agregar(usuario:Usuario){
		this.lista.push(usuario);
		console.log("[UsuarioLista|agregar]Usuario agregado");
		console.log("[UsuarioLista|agregar]Nueva lista de usuario=>",this.lista)
	}

	public getLista(){
		return this.lista;
	}

	public actualizarNombre(id:string, nombre:string){
		for(let usuario of this.lista){
			if(usuario.id === id){
				console.log("[UsuarioLista|actualizarNOmbre] modificando de: ");
				usuario.nombre = nombre;
				console.log("[UsuarioLista|actualizarNOmbre] a: ");
				break;
			}
		}
		console.log("[UsuarioLista|actualizarNombre]Nueva lista de usuario: =>",this.lista)
	}
	public getusuario(id:string){
		for(let usuario of this.lista){
			if(usuario.id===id){
				return usuario;
			}
		}
		console.log("[Usuariolista|getUsuario] No se encontro al usuario con ID: =>");
	}

	public borrarUsuario(id:string){
		this.lista = this.lista.filter((usuario)=>{
			if(usuario.id !== id){
				return usuario;
			}
		});
		console.log("[UsuarioLista|borrarusuario]Usuario borrado");
		console.log("[UsuarioLista|borrarusuario]Nueva lista de usuario=>",this.lista)
	}
}
