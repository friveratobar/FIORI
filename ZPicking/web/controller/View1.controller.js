 var s;
var audio   = new Audio(jQuery.sap.getModulePath("App00810ZpickingRecep.App00810ZpickingRecep") + "/media/beep_salfa7.mp3");
var audio2  = new Audio(jQuery.sap.getModulePath("App00810ZpickingRecep.App00810ZpickingRecep") + "/media/doink1_salfa.mp3");
var audio3  = new Audio(jQuery.sap.getModulePath("App00810ZpickingRecep.App00810ZpickingRecep") + "/media/warning_salfa1.mp3");
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"App00810ZpickingRecep/App00810ZpickingRecep/services/service",
	"App00810ZpickingRecep/App00810ZpickingRecep/util/utilController",
	"App00810ZpickingRecep/App00810ZpickingRecep/util/utilUI",
	"App00810ZpickingRecep/App00810ZpickingRecep/util/utils",
], function (Controller, Device, MessageBox, MessageToast, BusyIndicator, JSONModel, service, utilController, utilUI, utils) {
	"use strict";

	return Controller.extend("App00810ZpickingRecep.App00810ZpickingRecep.controller.View1", {
		onInit: function () {
				
			console.log("El path es: ...." +  jQuery.sap.getModulePath("App00800Zpiking.App00800Zpiking"));
				
			utilController.initModelView(this);
			var self = this;
			service.filtrosPicking(function (result) {
				self.onSetGTCentro(result.GT_CENTRO);
			});
			
			var that = this;
			
			$(document).keydown(function(evt){
			//	alert(evt.keyCode);
			if (evt.keyCode===0){
				 that.getView().byId("idInputHidden").setValue("");	
				 that.getView().byId("idInputHidden").focus();	
				
				}	
			});
		},
	    onAfterRendering: function() {
	      
        },
        onDialogAfterOpen: function(){
        //	this.getView().byId("idInputHidden").focus();
        //	console.log("dialog afteropen");
        },
        onCloseBusyDialog: function(evt){
        // console.log("onCloseBusyDialog");	
         //this.getView().byId("idInputHidden").focus();
        },
        onBuscarAlmacen: function(){
        
         var self = this;
         var centro = this.getView().byId("idCENTRO").getSelectedKey();
          console.log("onBuscarAlmacen" + centro); //
          
          var params = "?P_WERKS=" + centro + "&format=json";
				service.filtrosPickingAlmacen(params, function (result) {
					self.onSetGTalmacen(result.GT_ALMACEN);
            });
        },
        
        onValidaEntrega: function () {
        	
			var self = this;
			var valor       = this.getView().byId("idInputPto").getValue();
			var p_reimp     = this.getView().byId("idImport").getSelected();
		    //var p_retras  = this.getView().byId("idTraslado").getSelected();
		    var i_reimp  = "";
		    var i_retras = "";
		    var error   = "";
			
			if( p_reimp ){
				i_reimp = "X";
				
				var params = "?P_REIMP=" + i_reimp + "&P_RETRAS=" + i_retras + "&I_VBELN=" + valor + "&format=json";
				
				service.validaEntrada(params, 
				    function (result) {
					if (result.ERROR === "1") {
					sap.m.MessageToast.show(result.LOG,{duration: 3000});
					self.getView().byId("idInputPto").focus();
					//	utilUI.messageBox(result.LOG, "E", function () {});
					//	self.getView().byId("idBtnBuscar").setEnabled(false);
					 error = "1";
					 return error;
					}else{
						
					 self.onBuscarImpr();
					 //self.getView().byId("idBtnBuscar").setEnabled(true);
					}
				});
			}else {
				i_retras = "X";
				
				var params2 = "?P_REIMP=" + i_reimp + "&P_RETRAS=" + i_retras + "&I_VBELN=" + valor + "&format=json";
				
				service.validaEntrada(params2, function (result) {
					if (result.ERROR === "1") {
					sap.m.MessageToast.show(result.LOG,{duration: 3000});
					self.getView().byId("idInputPto").focus();
		      		   //utilUI.messageBox(result.LOG, "E", function () {});
				      //self.getView().byId("idBtnBuscar").setEnabled(false);
					  error = "1";
					  return error;
					}else{
					 // self.getView().byId("idBtnBuscar").setEnabled(true);
					 self.onBuscar();
					}
				});
			}
		},
/********************************************************************
 zpickingRecep - VALIDA FORMULARIO DE ENTRADA
*********************************************************************
*/	
		validaForm: function(){
			
		var p_reimp  =	this.getView().byId("idImport").getSelected();
		var p_retras =  this.getView().byId("idTraslado").getSelected();
	 	var p_vbeln  =  this.getView().byId("idInputPto").getValue().trim()=='';
		var p_werks  =  this.getView().byId("idCENTRO").getSelectedItem();
		var p_lgort  =  this.getView().byId("idALMACEN").getSelectedItem();
		
		if(p_reimp){
		 if (p_vbeln){
				sap.m.MessageToast.show("Todos los campos son obligatorios",{duration: 2000});
				this.getView().byId("idInputPto").setValueState("Error");

				
				this.getView().byId("idInputPto").focus();
				return true;
			}else{
					this.getView().byId("idInputPto").setValueState("None");
			}	
			
		}else if(p_retras){
			if (p_vbeln){
				sap.m.MessageToast.show("Todos los campos son obligatorios",{duration: 3000});
				this.getView().byId("idInputPto").focus();
				return true;
			}
		}
		
		if ( p_werks === null ) {
			    sap.m.MessageToast.show("Todos los campos son obligatorios",{duration: 3000});
			    this.getView().byId("idCENTRO").setValueState("Error");
			    this.getView().byId("idCENTRO").focus();
		 	    return true;
		}else{
				this.getView().byId("idCENTRO").setValueState("None");
		}
		
		if ( p_lgort === null ){
			    sap.m.MessageToast.show("Todos los campos son obligatorios",{duration: 3000});
			    this.getView().byId("idALMACEN").focus();
			    this.getView().byId("idALMACEN").setValueState("Error");
			    return true;
		}else{
				this.getView().byId("idALMACEN").setValueState("None");
		}
	},
		
/********************************************************************
zpickingRecep - BOTON BUSCAR
*********************************************************************
*/	
		onBuscar: function () {
        /* Validación del formulario de entrada*/
		if(this.validaForm()){
			return;
        }
        
			var self = this;
			//var objeto = utilUI.objectListItemSelectedItem(oEvent);
			var params = "?I_VBELN=" + this.getView().byId("idInputPto").getValue() + "&format=json";
			
			service.entregasFiori(params, function (result) {
			//	self.getView().byId("idPanelTitle").setText("Entrega " + self.getView().byId("idInputPto").getValue()   +  " ("+result.GT_ENTREGAS[0].VGBEL+")");
				self.onSetEntrega(result.GT_ENTREGAS);
			    self.getView().byId("idPanelTitle").setText("Entrega " +  " "+parseInt(result.GT_ENTREGAS[0].VBELN)+""+ " " +  " ("+result.GT_ENTREGAS[0].VGBEL+")"); //@frivera 07.05.2019
			    self.getView().byId("idPanelTitle2").setText("Entrega " +  " "+parseInt(result.GT_ENTREGAS[0].VBELN)+""+ " " +  " ("+result.GT_ENTREGAS[0].VGBEL+")"); //@frivera 07.05.2019
			    //self.getView().byId("inpVbeln").setValue(result.GT_ENTREGAS[0].VBELN);
			    utilController.property(self, "/Materiales", result.GT_ENTREGAS); //@frivera 07.05.2019
			//	console.log("Pasa por aqui");
				console.log(JSON.stringify(result.GT_ENTREGAS));
				utilController.refreshModel(self);
				self.validaListaMat(result.GT_ENTREGAS);
				
				var json = result.GT_ENTREGAS;
				var total = 0;
				var subtotal = 0;				
				for (var i = 0; i < json.length; i++) {
					total +=parseInt(json[i].LFIMG);
					subtotal +=parseInt(json[i].PIKMG);
				}
				
				self.byId("idPB").setDisplayValue(subtotal +  " / " + total);  
				var porcentaje = parseInt((subtotal * 100) / total);
				self.byId("idPB").setPercentValue(porcentaje);  
				
				if (porcentaje >= 60 && porcentaje !== 100) {
					self.getView().byId("idPB").setState("Warning");  
				} else if (porcentaje === 100) {
					self.getView().byId("idPB").setState("Success");  	
				} else if (porcentaje < 60){
					self.getView().byId("idPB").setState("Error"); 
				}	
				
			});

			s = 1;
			var that = this;

			this.getView().byId("idDialogEnt").setVisible(true);
			this.getView().byId("idDialogEnt").open();

			//that.getView().byId("idTablaEnt").setVisible(false);	
			that.getView().byId("bd").open();

			var timeout = jQuery.sap.delayedCall(800, this, function () {
				that.getView().byId("bd").close();
				//that.abrirDialogoResultado();
				//that.getView().byId("table").setVisible(true);		
				that.getView().byId("idInputHidden").setVisible(true);
				that.getView().byId("idPB").setVisible(true);
			});
	},
	
/********************************************************************
zpickingRecep - BOTON BUSCAR
*********************************************************************
*/	
		onBuscarImpr: function () {
        /* Validación del formulario de entrada*/
		if(this.validaForm()){
			return;
        }
        
			var self = this;
			//var objeto = utilUI.objectListItemSelectedItem(oEvent);
			var p_werks  =  this.getView().byId("idCENTRO").getValue().split("-")[0];
			var p_lgort  =  this.getView().byId("idALMACEN").getValue().split("-")[0];
			
			var params = "?I_VBELN=" + this.getView().byId("idInputPto").getValue() +
			             "&I_WERKS=" + p_werks +
			             "&I_LGORT=" + p_lgort + "&format=json";
			
			service.entregasImprFiori(params, function (result) {
			//	self.getView().byId("idPanelTitle").setText("Entrega " + self.getView().byId("idInputPto").getValue()   +  " ("+result.GT_ENTREGAS[0].VGBEL+")");
				self.onSetEntrega(result.GT_ENTREGAS);
			    self.getView().byId("idPanelTitle").setText("Entrega " +  " "+parseInt(result.GT_ENTREGAS[0].VBELN)+""+ " " +  " ("+result.GT_ENTREGAS[0].VGBEL+")"); //@frivera 07.05.2019
			    self.getView().byId("idPanelTitle2").setText("Entrega " +  " "+parseInt(result.GT_ENTREGAS[0].VBELN)+""+ " " +  " ("+result.GT_ENTREGAS[0].VGBEL+")"); //@frivera 07.05.2019
			    //self.getView().byId("inpVbeln").setValue(result.GT_ENTREGAS[0].VBELN);
			    utilController.property(self, "/Materiales", result.GT_ENTREGAS); //@frivera 07.05.2019
			//	console.log("Pasa por aqui");
				console.log(JSON.stringify(result.GT_ENTREGAS));
				utilController.refreshModel(self);
				self.validaListaMat(result.GT_ENTREGAS);
				
				var json = result.GT_ENTREGAS;
				var total = 0;
				var subtotal = 0;				
				for (var i = 0; i < json.length; i++) {
					total +=parseInt(json[i].LFIMG);
					subtotal +=parseInt(json[i].PIKMG);
				}
				
				self.byId("idPB").setDisplayValue(subtotal +  " / " + total);  
				var porcentaje = parseInt((subtotal * 100) / total);
				self.byId("idPB").setPercentValue(porcentaje);  
				
				if (porcentaje >= 60 && porcentaje !== 100) {
					self.getView().byId("idPB").setState("Warning");  
				} else if (porcentaje === 100) {
					self.getView().byId("idPB").setState("Success");  	
				} else if (porcentaje < 60){
					self.getView().byId("idPB").setState("Error"); 
				}	
				
			});

			s = 1;
			var that = this;

			this.getView().byId("idDialogEnt").setVisible(true);
			this.getView().byId("idDialogEnt").open();

			//that.getView().byId("idTablaEnt").setVisible(false);	
			that.getView().byId("bd").open();

			var timeout = jQuery.sap.delayedCall(800, this, function () {
				that.getView().byId("bd").close();
				//that.abrirDialogoResultado();
				//that.getView().byId("table").setVisible(true);		
				that.getView().byId("idInputHidden").setVisible(true);
				that.getView().byId("idPB").setVisible(true);
			});
	},
		
/********************************************************************
 Zpiking - VALIDACION EAN MASIVOS
*********************************************************************
*/	    


	onValidarEanMasivo : function (eans, ean) {
		var esEan = false;
		var arrEans = eans.split(",");
		for(var i=0; i < arrEans.length; i++){
			if(arrEans[i].trim() === ean.trim()){
				esEan = true;
			//	alert("EAN Encontrado");
				break;
			}
		}
		
		return esEan;
	},
	
	
/********************************************************************
zpickingRecep - SUBMIT EVENT PICKING
*********************************************************************
*/	
		onPickMaterial: function (e) {
			var valida_ean = false;
			this.getView().byId("idInputHidden").setBusy(true);
			var mat = this.getView().byId("idInputHidden").getValue();
		    
		    if(mat === ""){
		       sap.m.MessageToast.show("El lector no capturó el código de barra",{duration: 3000});
		       //alert("Material: " + mat);
		       valida_ean = true;
		    }
		    
			if (!valida_ean){
				
			this.getView().byId("idInputHidden").setValue("");
		//	this.getView().byId("idInputHidden").focus();

			var json = utilController.property(this, "/ENTREGA");
			var oJsonMateriales = utilController.property(this, "/Materiales"); //@frivera 07.05.2019
			//alert(JSON.stringify(json));
			var that = this;
			this.getView().byId("idInputHidden").setBusy(false);
			var numSap = "";
			var swEncontrado = false;
			var total = 0;
			var subtotal = 0;
			
			for (var i = 0; i < json.length; i++) {
				total +=parseInt(json[i].LFIMG);
				subtotal +=parseInt(json[i].PIKMG);
			}	
			
			for (var i = 0; i < json.length; i++) {
				
				if (json[i].EAN11 === mat || this.onValidarEanMasivo(json[i].EANS, mat)) {
					if(parseInt(json[i].PIKMG) >= parseInt(json[i].LFIMG) ){
						/*
						MessageBox.warning("Límite de picking alcanzado. ", {
							title: "Información"
						});*/
						swEncontrado = true;
						sap.m.MessageToast.show("Límite de Picking alcanzado para material:  " + parseInt(json[i].MATNR),{duration: 1200});
						     this. showColor("a", "#FF8000");
						     audio2.play();
						     this.getView().byId("idDialogEnt").focus();
						     this.getView().byId("idDialogEnt").blur();
						     
						
					}else{
					//alert(json[i].MATNR);
					numSap = json[i].MATNR;
					var cont = json[i].PIKMG.toString().trim(); 
					if(cont==="" || cont === 0){
						cont = 1;
					}else{
						cont = parseInt(cont)+1;
					}
					json[i].PIKMG = cont;
					oJsonMateriales[i].PIKMG= cont;//@frivera 06.05.2019
					if(parseInt(subtotal) === 0){
						subtotal = 1;
					}else{
						subtotal++;
					}
					audio.play();
					var modelData = new sap.ui.model.json.JSONModel({
						"cantidad": total,
						"cantidadConteo": subtotal,
						"porcentaje": 0,
						"estado": "Error"
					});
					this.getView().setModel(modelData, "modelData");
					this.getView().byId("idCtdConteo").setDisplayValue(json[i].PIKMG +  " / " + json[i].LFIMG);
					
					oJsonMateriales[i].DISPLAY = oJsonMateriales[i].PIKMG + "/" + oJsonMateriales[i].LFIMG; //@frivera 06.05.2019
					
					var porcentaje0 = parseInt((json[i].PIKMG * 100) / json[i].LFIMG);
					this.getView().byId("idCtdConteo").setPercentValue(porcentaje0);  	
					
					var percent =   parseInt((oJsonMateriales[i].PIKMG * 100) / oJsonMateriales[i].LFIMG);//@frivera 06.05.2019
                    oJsonMateriales[i].PERCENT = percent;

					this.getView().byId("idPB").setDisplayValue(subtotal +  " / " + total);  
					var porcentaje = parseInt((subtotal * 100) / total);
					this.getView().byId("idPB").setPercentValue(porcentaje);  
					
					this.getView().byId("idMaterial").setText(json[i].MATNR.substring(json[i].MATNR.length - 6, json[i].MATNR.length) + " - " +  json[i].ARKTX);
					this.getView().byId("idTextoBreve").setText(json[i].ARKTX);
				//	this.getView().byId("idCodSap").setText(json[i].ARKTX);					
					
					if (porcentaje > 60 && porcentaje !== 100) {
						this.getView().byId("idPB").setState("Warning");  	
					} else if (porcentaje === 100) {
						this.getView().byId("idPB").setState("Success");  	
					}					
					
					if (porcentaje0 >= 60 && porcentaje0 !== 100) {
						this.getView().byId("idCtdConteo").setState("Warning");  
						oJsonMateriales[i].STATE = "Warning"; //@frivera 07.05.2019
					} else if (porcentaje0 === 100) {
						this.getView().byId("idCtdConteo").setState("Success");  
						oJsonMateriales[i].STATE = "Success"; //@frivera 07.05.2019
					} else if (porcentaje0 < 60){
						this.getView().byId("idCtdConteo").setState("Error"); 
						oJsonMateriales[i].STATE = "Error";
					}		
					
					utilController.property(that, "/Materiales", oJsonMateriales);
				    
				    jQuery.sap.delayedCall(500, this, function() {
                   // this.getView().byId("idInputHidden").focus();
                     });
		  /*  var thisView = this;
		       $(".myClass").keypress(function(e) {
               if (e.which == 13) {
               thisView.getView().byId("idInputHidden").focus();
                }
                });*/
					swEncontrado = true;
					break;
					}
				} else {
				/*	MessageBox.warning("Material no existe o no pertenece a la entrega ", {
						title: "Información"
					});*/
				}
			}
			if(!swEncontrado){
					sap.m.MessageToast.show("Código de barras no existe en la entrega: " + this.getView().byId("idInputPto").getValue(),{duration: 2000});
					this.showColor("a", "#cc1919");					
					audio2.play();
					this.getView().byId("idDialogEnt").focus();
			}
			document.activeElement.blur();
			//var pickModel = this.getView().getModel("pickModel");
			//var registros = json;
			}
		/*	}*/
           this.getView().byId("idInputHidden").setBusy(false);
	},	
		abrirIncidente: function () {
			this.getView().byId("idDialogAccidente").setVisible(true);
			this.getView().byId("idDialogAccidente").open();
	},
		
/********************************************************************
ZpickingRecep - GRABAR INICIDENTE
*********************************************************************
*/		
		aceptarIncidente: function (){ 
 		
		   var validaDetalle =	this.getView().byId("inpDetalle").getValue().trim()=='';
				if(validaDetalle){
				sap.m.MessageToast.show("Detalle Obligatorio",{duration: 3000});
				this.getView().byId("inpDetalle").focus();
				return;
				}
		
			var that = this;
			var objeto1 = [];
			
		var	p_Vbeln       = this.getView().byId("inpVbeln").getValue();
		var p_Matnr       = this.getView().byId("inpMatnr").getValue();
		var p_Accion      = this.getView().byId("inpAccion").getValue();
		var P_CantTeorica = parseInt( this.getView().byId("inpCantTeorica").getValue());
		var p_CantReal    = parseInt(this.getView().byId("inpCantReal").getValue());
		var p_Motivo      = this.getView().byId("inpMotivo").getValue();
		var p_Detalle     = this.getView().byId("inpDetalle").getValue();
		
		var params = "?P_VBELN="     + p_Vbeln  + 
		             "&P_MATNR="     + p_Matnr  + 
		             "&P_MOTIVO="    + p_Motivo +
		             "&P_CANT_TEO="  + P_CantTeorica  + 
		             "&P_CANT_REAL=" + p_CantReal +
		             "&P_DETALLE="   + p_Detalle +
		             "&P_ACCION="    + p_Accion
		              ;
		              
		service.creaIncidencia(params, function (result) {
					if (result.ESTADO === "E") {
	                 sap.m.MessageBox.success('Error de sistema la incidencia no fue guardada');  
					}else{
					sap.m.MessageBox.success('Incidencia guardada exitosamente');	
					}
				});
		},
		
	    esConfirmacion : function () {
			var that = this;
			var dialog = new sap.m.Dialog({
				title: 'Confirmar',
				type: 'Message',
				content: new sap.m.Text({ text: '¿Confirmar Picking?' }),
				beginButton: new sap.m.Button({
					text: 'Confirmar',
					press: function () {
						that.confirmarEntrega();
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},
/********************************************************************
 ZpickingRecep - CHECK DE MATERIALES
*********************************************************************
*/
		validaListaMat: function(data){
			var self         = this;
			var swv          = false;
			var matx         = "";
			var matnr        = "";
		//	var json = utilController.property(this, "/ENTREGA");
			var jsonEntrega  = data;
			var mensaje      = "";
			var contador     = 0;
			var cabMensaje   = "";
			if (undefined !== jsonEntrega && jsonEntrega.length) {
			
			for (var i = 0; i < jsonEntrega.length; i++) {			
				if(jsonEntrega[i].EAN11 === "" || jsonEntrega[i].EAN11 === "N/A"){
					swv     = true;
					matx    = jsonEntrega[i].ARKTX;
					matnr   = jsonEntrega[i].MATNR;
					matnr   = +matnr;
					mensaje = mensaje + "Material: " + matx + "\n" + "Código SAP: " + matnr+ "\n";
					contador = contador + 1;
				  }
				}
				   if(contador <= 1){
				   	 cabMensaje   = "Se detecto " + contador + " material sin código de barras:" + "\n";
				   }else{
				   	 cabMensaje   = "Se detectaron " + contador + " materiales sin código de barras:" + "\n";
				   }
				   
				   mensaje = cabMensaje + mensaje;
				   
			if(swv){
				MessageBox.warning(mensaje, {
							title: "Aviso",
							onClose: function(oAction) { 
									jQuery.sap.delayedCall(500, this, function() {
                                   // self.getView().byId("idInputHidden").focus();
                                   });	
							}
						});
			}
           } else {
             
           }
	},
		
		confirmarEntrega: function () {
			            
	    var p_reimp  =	this.getView().byId("idImport").getSelected();
		var p_retras =  this.getView().byId("idTraslado").getSelected();
		var p_werks  =  this.getView().byId("idCENTRO").getValue().split("-")[0];
		var p_lgort  =  this.getView().byId("idALMACEN").getValue().split("-")[0];
		
		var i_vbeln  = "";	
		var i_reimp  = "";
		var i_retras = "";
		
		if (p_reimp ){
			i_reimp = "X";
		}else if(p_retras){
			i_retras = "X";
		}
			var that = this;

		    var oJsonMateriales = utilController.property(this, "/Materiales");
			var objeto1 = [];

			for (var n = 0; n < oJsonMateriales.length; n++) {
			     if(n === 0){
			       i_vbeln = oJsonMateriales[n].VBELN;
			     }
				}
			for (var i = 0; i < oJsonMateriales.length; i++) {
			     if(i === 0){
			     i_vbeln = oJsonMateriales[i].VBELN;
			     }
			    if(parseInt(oJsonMateriales[i].PIKMG) > 0){
					objeto1.push({
				    "VBELN": oJsonMateriales[i].VBELN,
					"POSNR": oJsonMateriales[i].POSNR,
					"EAN11": oJsonMateriales[i].EAN11,
					"MATNR": oJsonMateriales[i].MATNR,
					"MFRPN": oJsonMateriales[i].MFRPN,
					"MAKTX": oJsonMateriales[i].ARKTX,
					"LGPBE": oJsonMateriales[i].LGPBE,
					"LFIMG": oJsonMateriales[i].PIKMG,
				 	"MEINS": "", 
					"WERKS": oJsonMateriales[i].WERKS,
					"VGBEL": oJsonMateriales[i].VGBEL,
					"VGPOS": oJsonMateriales[i].VGPOS,
					"LGORT": oJsonMateriales[i].LGORT
					});
			    }
			}
			
		  var filter = {
				"P_REIMP":  i_reimp,  // Importacion  "entrega entrante
				"P_RETRAS": i_retras, // Traslado     "entrega de salida
				"I_VBELN":  i_vbeln,  // Entrega 
				"I_WERKS":  p_werks,  // Centro 
				"I_LGORT":  p_lgort,  // Almacen
				"GT_ENTRADAS": objeto1
			};

			    //console.log("ENTRADA" + JSON.stringify(filter));
			utilUI.gloading(true);
			service.grabarNeumatico(filter, function (result) {
				utilUI.gloading(false);
				//console.log("---");
			    //console.log("SALIDA" + JSON.stringify(result));
				//audio3.play();
					if(result.LOG === "" && result.ERROR === ""){
					MessageBox.warning("El proceso fue ejecutado exitosamente: " + result.MBLNR, {
						title: "Información"
					});
					
					that.onCerrarDialog();
					
				  }
				  
				  if (result.ERROR !== ""){
				  	MessageBox.warning(result.LOG, {
						title: "Información"
					});
					
					that.onCerrarDialog();
				  }
			});
	   },
		cerrarIncidente: function () {
			this.getView().byId("idDialogAccidente").setVisible(false);
			this.getView().byId("idDialogAccidente").close();
		},
		irImport: function () {
			var p_reimp  =	this.getView().byId("idImport").getSelected();
		    if(p_reimp){
		    	this.getView().byId("elemVariable").setLabel("Entrega Entrante");
		    }
		},
		
		formatCero : function (param){
		 return parseInt(param);	
		},		
		
		estadoMaterial : function (param){
			if(param === null || param === undefined || param === undefined || param === "" || param === "N/A"){
				return "Error";
			}else{
				return "None";
			}
		},
		
		visibleColumna : function (param) {
			
			if(param === "" || param === undefined || param === undefined || param === "" || 
				parseInt(param) === 0){
				return false;	
			}else{
				
			}
			
			
		},
		
		irTraslado: function () {
			 var p_retras =  this.getView().byId("idTraslado").getSelected();
			 if (p_retras){
			 	this.getView().byId("elemVariable").setLabel("Entrega");
			 }
		},
		onSetFiltroBusqueda: function (lista) {
			utilController.property(this, "/FiltroBusqueda", lista);
			utilController.refreshModel(this);
		},
		onSetEntrega: function (lista) {
			utilController.property(this, "/ENTREGA", lista);
			utilController.refreshModel(this);
		},
		onSetPicking: function (lista) {
			utilController.property(this, "/LISTAPICK", lista);
			utilController.refreshModel(this);
		},
		onSetGTalmacen: function (lista) {
			utilController.property(this, "/GT_ALMACEN", lista);
			utilController.refreshModel(this);
		},
		onSetGTCentro: function (lista) {
			utilController.property(this, "/GT_CENTRO", lista);
			utilController.refreshModel(this);
		},
		onCerrarDialog: function () {
	    /*Input Scan Neumatico */
			this.getView().byId("idInputHidden").setValue();
		/*Input de Incidentes */
	     	this.getView().byId("inpVbeln").setValue("");
		/*ProgressIndicators */	
			this.getView().byId("idPB").setDisplayValue(""); 
		    this.getView().byId("idPB").setPercentValue(0);
		    this.getView().byId("idCtdConteo").setDisplayValue("");
		    this.getView().byId("idCtdConteo").setPercentValue(0);
		/* Text */
		    this.getView().byId("idTextoBreve").setText("");
		   // this.getView().byId("idEstadoScan").setText("");
		    this.getView().byId("idPieza").setText("");
		    this.getView().byId("idMaterial").setText("");
		    this.getView().byId("idTipoMaterial").setText("");
		    this.getView().byId("idCreadoPor").setText("");
		    this.getView().byId("idCtd").setText("");
		/* Cierra Dialog */	
		    this.getView().byId("idDialogEnt").setVisible(false);
			this.getView().byId("idDialogEnt").close();
		},
	    onLimpiar: function(){
	    	this.getView().byId("idInputPto").setValue("");
	    	this.getView().byId("idCENTRO").setValue("");
	        this.getView().byId("idALMACEN").setValue("");
	    },
	    
		
		showColor : function (Flag, color) {
			
			var id = "#application-zapppickingrecep-Display-component---View1--idDialogEnt";
					   
	//		var id = "#application-zapppickingrece-Display-component---View1--idDialogEnt";
		
		      var oContentDOM = $(id); 
		      var oParent = $(id).parent(); 
		      var oMessageToastDOM = $(id).parent().find('.sapMMessageToast');
		      oMessageToastDOM.css('background', color);
		      oMessageToastDOM.css('top',  '10px');
		      oMessageToastDOM.css('left', '50px');
		      oMessageToastDOM.css('font-size', '35px');
		      oMessageToastDOM.css('display', 'block');
		      oMessageToastDOM.css('opacity', '1');
		      oMessageToastDOM.css('transition', 'all .3s');
		      oMessageToastDOM.css('-wekit-transition', 'all .3s');
		      oMessageToastDOM.css('-moz-transition', 'all .3s');
		      
		      
		      
		      oMessageToastDOM.css('height', '200px'); 
		      
		      
			  window.setInterval(function(){ 
			           oMessageToastDOM.css('visibility', 'hidden');
			           oMessageToastDOM.css('display', 'none');
	
			  }, 2000);		      

		      
    	},
    	
    	
		
		showColorLP : function (Flag, color) {
			//application-zapppickingrecep-Display-component---View1--idDialogEnt-cont
			
			var id = "#container-App00810ZpickingRecep---View1--idDialogEnt";
			//var id = "#container-App00800Zpiking---View1--idDialogEnt-scroll"
			//var id = "#container-App00800Zpiking---View1--idDialogEnt-cont"
		      var oContentDOM = $(id); 
		      var oParent = $(id).parent(); 
		      var oMessageToastDOM = $(id).parent().find('.sapMMessageToast');
		      oMessageToastDOM.css('background', color);
		      oMessageToastDOM.css('top',  '10px');
		      oMessageToastDOM.css('left', '50px');
		      oMessageToastDOM.css('font-size', '35px');
		      oMessageToastDOM.css('display', 'block');
		      oMessageToastDOM.css('opacity', '1');
		      oMessageToastDOM.css('transition', 'all .3s');
		      oMessageToastDOM.css('-wekit-transition', 'all .3s');
		      oMessageToastDOM.css('-moz-transition', 'all .3s');
		      
		      
		      
		      oMessageToastDOM.css('height', '200px'); 
		      
		      
			  window.setInterval(function(){ 
			           oMessageToastDOM.css('visibility', 'hidden');
			           oMessageToastDOM.css('display', 'none');
	
			  }, 2000);		      

		      
    	},    	
    	
    	
    	
    	
	});
});