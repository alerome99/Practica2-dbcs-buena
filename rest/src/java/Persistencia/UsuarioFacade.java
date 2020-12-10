/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Persistencia;

import Dominio.Usuario;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author arome
 */
@Stateless
public class UsuarioFacade extends AbstractFacade<Usuario> implements UsuarioFacadeLocal {
    @PersistenceContext(unitName = "Practica2PU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }
    
    public UsuarioFacade() {
        super(Usuario.class);
    }

    @Override
    public Usuario getUsuarioUserPassword(String nifcif, String password) {
        return (Usuario) em.createNamedQuery("Usuario.findByUserPassword").setParameter(1, nifcif).setParameter(2, password).getResultList().get(0);
    }
    
}
