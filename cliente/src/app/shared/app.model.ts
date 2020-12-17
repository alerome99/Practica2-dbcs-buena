export interface Usuario{
    nifcif:String,
    nombre:String,
    direccionpostal:String,
    ciudad:String,
    pais:String,
    direccionelectronica:String,
    telefono:String,
    password:String
}

export interface Rolempleado{
    idrol:Number,
    nombrerol:String
}

export interface Empleado{
    nifcif:String,
    fechacontratacion:Date,
    rol:Number
}

export interface Empresa{
    nifcif:String,
    escliente:Number,
    esproveedor:Number
}

export interface Configuracionpc{
    idconfiguracion:Number,
    tipocpu:String,
    velocidadcpu:Number,
    capacidadram:Number,
    capacidaddd:Number,
    velocidadtarjetagrafica:Number,
    memoriatarjetagrafica:Number,
    precio:number
}

export interface Estadoventapcs{
    idestadoventa:Number,
    nombreestadoventa:String
}

export interface Pedidopc{
    idpedido:Number,
    cantidadsolicitada:Number,
    estado:Number,
    configuracionsolicitada:Number,
    encargadopor:String
}

export interface Login{
    password:String
}

export interface Pais{
    pais:String
}

export interface Conversion{
    dineroconvertido:number
}

export interface ErrorM{
    mensajeErr:boolean
}
