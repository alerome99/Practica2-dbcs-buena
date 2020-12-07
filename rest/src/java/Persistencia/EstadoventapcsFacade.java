/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Persistencia;

import Dominio.Estadoventapcs;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author arome
 */
@Stateless
public class EstadoventapcsFacade extends AbstractFacade<Estadoventapcs> implements EstadoventapcsFacadeLocal {
    @PersistenceContext(unitName = "Practica2PU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public EstadoventapcsFacade() {
        super(Estadoventapcs.class);
    }
    
}
