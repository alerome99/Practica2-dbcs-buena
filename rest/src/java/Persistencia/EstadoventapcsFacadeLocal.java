/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Persistencia;

import Dominio.Estadoventapcs;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author arome
 */
@Local
public interface EstadoventapcsFacadeLocal {

    void create(Estadoventapcs estadoventapcs);

    void edit(Estadoventapcs estadoventapcs);

    void remove(Estadoventapcs estadoventapcs);

    Estadoventapcs find(Object id);

    List<Estadoventapcs> findAll();

    List<Estadoventapcs> findRange(int[] range);

    int count();
    
}
