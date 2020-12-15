/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Rest;

import Dominio.Configuracionpc;
import Dominio.Pedidopc;
import Dominio.Usuario;
import Persistencia.ConfiguracionpcFacadeLocal;
import Persistencia.EmpleadoFacadeLocal;
import Persistencia.UsuarioFacadeLocal;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author arome
 */
@Path("ordenadores")
public class OrdenadoresResource implements ContainerResponseFilter{
    ConfiguracionpcFacadeLocal configuracionpcFacade = lookupConfiguracionpcFacadeLocal();
    EmpleadoFacadeLocal empleadoFacade = lookupEmpleadoFacadeLocal();
    UsuarioFacadeLocal usuarioFacade = lookupUsuarioFacadeLocal();
    
    @Context
    private UriInfo context;
    
    /**
     * Creates a new instance of OrdenadoresResource
     */
    public OrdenadoresResource() {
    }

    /**
     * Retrieves representation of an instance of Rest.OrdenadoresResource
     * @return an instance of java.lang.String
     */
    
    @GET
    @Produces("application/json")
    public Response getConfiguraciones() {
        Response.ResponseBuilder respuesta = Response.status(Response.Status.OK);
        List<Configuracionpc> confs = configuracionpcFacade.findAll();
        if (confs == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        Configuracionpc[] arrayConfiguracion = new Configuracionpc[confs.size()];
        for (int i = 0; i < arrayConfiguracion.length; i++) {
            arrayConfiguracion[i] = confs.get(i);
        }
        respuesta.entity(arrayConfiguracion); // Añadimos el cuerpo (contenido) de la respuesta
        return respuesta.build();
    }
    
    @Path("/{id}/conf")
    @GET
    @Produces("application/json")
    public Response getConfiguracion(@PathParam("id") int id) {
        Response.ResponseBuilder respuesta = Response.status(Response.Status.OK);
        try {
            Configuracionpc conf = (Configuracionpc) configuracionpcFacade.find(id);      
            respuesta.entity(conf);
            return respuesta.build();
        } catch (Exception e) {
            respuesta.status(Response.Status.INTERNAL_SERVER_ERROR);
            return respuesta.build();
        }
    }
    
    @GET
    @Path("/{login}")
    @Produces("application/json")
    public Response getUserLogin(@PathParam("login") String username,
            @Context HttpHeaders headers) { 
        String authorization = headers.getRequestHeader("Authorization").get(0);
        Usuario user = usuarioFacade.getUsuarioUserPassword(username, authorization);
        if(user==null){
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }else{
            if(empleadoFacade.find(username)==null){
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }else{
                return Response.status(Response.Status.OK).build();
            }
        }
    }
    
    @GET
    @Path("/{user}/pais")
    @Produces("application/json")
    public Response getPais(@PathParam("user") String username) {
        Response.ResponseBuilder respuesta = Response.status(Response.Status.OK);
        try {
            Usuario user = (Usuario) usuarioFacade.find(username);   
            String pais = "{ \"pais\":\"" + user.getPais() + "\" }";
            respuesta.entity(pais);
            return respuesta.build();
        } catch (Exception e) {
            System.err.println(e.getMessage());
            respuesta.status(Response.Status.INTERNAL_SERVER_ERROR);
            return respuesta.build();
        }
    }
    
    @Path("{id}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response modificarConfiguracion(JsonObject confModif, @PathParam("id") int id) {
        Response.ResponseBuilder respuesta = Response.noContent();
        try {
            Configuracionpc conf = configuracionpcFacade.find(id);
            conf.setTipocpu(confModif.getString("tipocpu"));
            conf.setCapacidaddd(confModif.getInt("capacidaddd"));
            conf.setCapacidadram(confModif.getInt("capacidadram"));
            conf.setMemoriatarjetagrafica(confModif.getInt("memoriatarjetagrafica"));
            conf.setVelocidadtarjetagrafica(confModif.getInt("velocidadtarjetagrafica"));
            conf.setVelocidadcpu(confModif.getInt("velocidadcpu"));
            JsonNumber jn = confModif.getJsonNumber("precio");
            String pre = jn.toString();
            Float precio = Float.parseFloat(pre);
            conf.setPrecio(precio);
            configuracionpcFacade.edit(conf);
            respuesta.status(Response.Status.NO_CONTENT);
            return respuesta.build();
        } catch (Exception e) {
            System.err.println(e.getMessage());
            respuesta.status(Response.Status.INTERNAL_SERVER_ERROR);
            return respuesta.build();
        }
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addConfiguracionpc(JsonObject conf) {
        Response.ResponseBuilder respuesta = Response.noContent();
        try {
            Configuracionpc newConf = new Configuracionpc();
            newConf.setTipocpu(conf.getString("tipocpu"));
            newConf.setIdconfiguracion(conf.getInt("idconfiguracion"));
            newConf.setVelocidadcpu(conf.getInt("velocidadcpu"));
            newConf.setCapacidadram(conf.getInt("capacidadram"));
            newConf.setCapacidaddd(conf.getInt("capacidaddd"));
            newConf.setVelocidadtarjetagrafica(conf.getInt("velocidadtarjetagrafica"));
            newConf.setMemoriatarjetagrafica(conf.getInt("memoriatarjetagrafica"));
            JsonNumber jn = conf.getJsonNumber("precio");
            String pre = jn.toString();
            Float precio = Float.parseFloat(pre);
            newConf.setPrecio(precio);
            List<Pedidopc> lista = new ArrayList<>();
            newConf.setPedidopcList(lista);     
            configuracionpcFacade.create(newConf);
            respuesta.status(Response.Status.NO_CONTENT);
            return respuesta.build();
        } catch (Exception e) {
            System.err.println(e.getMessage());
            respuesta.status(Response.Status.INTERNAL_SERVER_ERROR);
            return respuesta.build();
        }
    }
    
    @Path("borrar/{id}")
    @DELETE
    public Response borrarConfiguracion(@PathParam("id") int id) {
        Response.ResponseBuilder respuesta = Response.noContent();
        try {
            Configuracionpc conf = (Configuracionpc) configuracionpcFacade.find(id);
            configuracionpcFacade.remove(conf);     
            respuesta.status(Response.Status.NO_CONTENT);
            return respuesta.build();
        } catch (Exception e) {
            respuesta.status(Response.Status.INTERNAL_SERVER_ERROR);
            return respuesta.build();
        }
    }
    
    /**
     * PUT method for updating or creating an instance of OrdenadoresResource
     * @param content representation for the resource
     * @return an HTTP response with content of the updated or created resource.
     */
    @PUT
    @Consumes("application/json")
    public void putJson(String content) {
    }

    private UsuarioFacadeLocal lookupUsuarioFacadeLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (UsuarioFacadeLocal) c.lookup("java:global/Practica2/UsuarioFacade!Persistencia.UsuarioFacadeLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    private EmpleadoFacadeLocal lookupEmpleadoFacadeLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (EmpleadoFacadeLocal) c.lookup("java:global/Practica2/EmpleadoFacade!Persistencia.EmpleadoFacadeLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext response) throws IOException {
        response.getHeaders().putSingle("Access-Control-Allow-Origin", "*");
        response.getHeaders().putSingle("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
        response.getHeaders().putSingle("Access-Control-Allow-Headers", "Content-Type");
    }

    private ConfiguracionpcFacadeLocal lookupConfiguracionpcFacadeLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (ConfiguracionpcFacadeLocal) c.lookup("java:global/Practica2/ConfiguracionpcFacade!Persistencia.ConfiguracionpcFacadeLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
