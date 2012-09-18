static var bCraft : boolean;			 	// flag inventory button was pressed
static var bNeedToUpdateCraft : boolean;
var bNeedToResetItem : boolean;

//var texCraftFrame : Texture2D;			// texture for craft frame
//var texItemCraftFrame : Texture2D;
//var itemsCraft = new Array(Item);
//var backbtnstyle: GUIStyle;
//var btnstyle 	  : GUIStyle;
//var texFrame	  : Texture2D;
//var intScrollPos: int;
//var texAux	  : Texture2D;
static var craftBack : boolean = false;
static var butDown : boolean = false;
var texLoaderWheel : Texture2D;
var nAngle : float;
var changedLvl : boolean ;
var styleLowerUpper : GUIStyle;
var styleLoow : GUIStyle;
var scrollPosition : Vector2;
var nFirstPos	: int;
var nIngredients : int;
var itemToCraft : int;

var nUserId		: int;
var allItems	: Item2[];
var myItems		: Item[];
var nItems		: int;
var texBack		: Texture2D;
var texCraft	: Texture2D;
var sCraft		: String;
var sIngredients: String;
var cIngredients : String;  //craft ingredients + quantity
var bNewCraft	: boolean;
var nCraftPos	: int;
var bFirstItemSet : boolean;

var styleCraftIngredients : GUIStyle;
var styleList	: GUIStyle;
var stylePlus   : GUIStyle;
var texCraftBut	: Texture2D;
var texCraftButP: Texture2D;
var texBackBut 	: Texture2D;
var texBackButP	: Texture2D;
var touch 		: Touch;
var scrollPos	: float;
var scrollFrame	: Rect;
var nCraftItems	: int;

var styleBut	: GUIStyle;
var styleButP	: GUIStyle;
var style		: GUIStyle;
var styleText1	: GUIStyle;
var styleText2	: GUIStyle;
var sTitle		: String;


var styleDiff1 			: GUIStyle;
var styleDiff2 			: GUIStyle;
var styleDiff3 			: GUIStyle;
var styleDiff4   		: GUIStyle;
var styleDiff5			: GUIStyle;
var styleDiff6 			: GUIStyle;

var styleBackBut		: GUIStyle;
var styleCraftBut		: GUIStyle;





var neededItems	: Texture2D[];
var neededString : String[];
var upperLimit : int;
var lowerLimit : int; 
var changedLvl1 : boolean;
var changedLvl2 : boolean;
var changedLvl3 : boolean;
var changedLvl4 : boolean;
var changedLvl5 : boolean;
var changedLvl6 : boolean;

var v : int[];
var is_updating	: boolean;
var itemToDisplay : GUIContent;
var texItemToDisplay : Texture2D[];
var texCategoryToDisplay : Texture2D[];

function Start() 
{
    changedLvl1 = true;
    changedLvl2 = false;
    changedLvl3 = false;
    changedLvl4 = false;
    changedLvl5 = false;
    changedLvl6 = false;
   
    lowerLimit = 0;
    upperLimit = 9;
    neededItems = new Texture2D[5];
    neededString = new String[5];
    v = new int[4];
	is_updating = false;
	nCraftPos = -1;
	nUserId = Global.myChar.id;
	bCraft = false;
	scrollPosition = Vector2.zero;
	scrollFrame = Rect(Global.screenW * 0.2708, Global.screenH * 0.25	, Global.screenW * 0.2916, Global.screenH * 0.71875);
	GetCraftItems();
    Resources.UnloadUnusedAssets();
}

function GetCraftItems()
{
	while(is_updating)
		{	
			yield WaitForSeconds(Time.deltaTime);	
		}
	//print("NOW Get ITEMS");
	is_updating = true;
	var download : WWW = new WWW(Global.server+"/mmo_iphone/craft.php");
	yield download;
	
	while (download.error && download.error.ToString().Contains("Resolving host timed out"))
	    {
	    	Debug.Log( "Retrying" );
			download = new WWW(Global.server+"/mmo_iphone/craft.php");
			yield download;
	    }

	var sAllItems : String = download.text;
	var i : int;
	var j : int;
	var k : int;
	var bCraftable : boolean;
	var bFound : boolean;
	bFirstItemSet = false;
	nItems = 0;
	//print(sAllItems);
	var values : String[] = Regex.Split(sAllItems, "<br />");
	allItems = new Item2[values.length-1];
	texItemToDisplay = new Texture2D[values.length-1];
	texCategoryToDisplay = new Texture2D[ values.length -1 ];
	
	for(i = 0; i<values.length-1; i++)
	{
		allItems[i] = Item2(values[i]);
		
		switch( allItems[ i ].craft_type )
			{
				case CommonConstants.CRAFT_WEAPON:
					texCategoryToDisplay[ i ] = Resources.Load( "Menus/Menu_Craft/weapon", Texture2D );
				break;
				case CommonConstants.CRAFT_ARMOR:
					texCategoryToDisplay[ i ] = Resources.Load( "Menus/Menu_Craft/armor", Texture2D );
				break;
				case CommonConstants.CRAFT_SUMMON:
					texCategoryToDisplay[ i ] = Resources.Load( "Menus/Menu_Craft/summon", Texture2D );
				break;
				case CommonConstants.CRAFT_CONSUMABLE:
					texCategoryToDisplay[ i ] = Resources.Load( "Menus/Menu_Craft/consumable", Texture2D );
				break;
			}
		texItemToDisplay[i] = Resources.Load("Menus/Inventory/Icons/" + allItems[i].id);
	}
	
	download = new WWW(Global.server+"/mmo_iphone/items-on.php?id=" + nUserId);
	yield download;
	
	while (download.error && download.error.ToString().Contains("Resolving host timed out"))
	    {
	    	Debug.Log( "Retrying" );
			download = new WWW(Global.server+"/mmo_iphone/items-on.php?id=" + nUserId);
			yield download;
	    }

	var sInventory : String = download.text;
	values = Regex.Split(sInventory, "<br />");
	myItems = new Item[values.length-1];
	
	for(i = 0; i<values.length-2; i++)
		{
			myItems[i] = Item(Regex.Split(values[i+1], ":"));
			//print(myItems[i] + "lalalala");
		}
	
	for(i = 0; i<allItems.length; i++)
		{
			j = 0;
			bCraftable = true;
			
			while(j<allItems[i].craft_id.length && bCraftable)
				{
					k = 0;
					bFound = false;
					while(k<myItems.length-1 && !bFound)
						{
							if(myItems[k].id == allItems[i].craft_id[j] && myItems[k].quantity >= allItems[i].craft_quantity[j])
								{
									//print(myItems[k].quantity);
									//print(allItems[i].craft_quantity[j]);
									bFound = true;
								}
							k++;
						}
					if(!bFound) 
						bCraftable = false;
					j++;
				}
			if(bCraftable)
				{
					allItems[i].available = true;
					nItems++; 
					
					if(!bFirstItemSet)
						{
							nFirstPos = i;
							bFirstItemSet = true;
						}
				}
		}
	is_updating = false;
}

function ScrollButton(aRect : Rect, aStr : String) : boolean
{
	if(aRect.yMin>35 && aRect.yMax<307) return GUI.Button(aRect, aStr, styleList); else return false;
}

function ScrollButton(aRect : Rect, aCnt : GUIContent) : boolean
{
	if(aRect.yMin>70 && aRect.yMax<320) return GUI.Button(aRect, aCnt, styleList); else return false;
	//return GUI.Button(aRect, aCnt, styleList);
}

function ClearCraft()
{
	nCraftPos = -1;
	for(var i = 0; i<allItems.length; i++)
			allItems[i].available = false;
}

function Update()
{
	if(bCraft && Input.touchCount > 0)
		{
			touch = Input.GetTouch(0); 
			
			if(touch.phase == TouchPhase.Moved)
				{
		    		//only dragging
		    		//print("now drag ah buy");
		    		if(scrollFrame.Contains(Vector2(touch.position.x,320 -touch.position.y)))
		    			scrollPosition.y += touch.deltaPosition.y;
				}
		}
}

function UpdateItems()
{
	while (is_updating)
		{
			yield WaitForSeconds(Time.deltaTime);	
		}
	print("NOW update ITEMS"); 
	
	is_updating = true;
	var postData = new WWWForm();
	var vector : String = "";
	print("NOW update ITEMS121321"); 
	postData.AddField("user_id", nUserId);
	postData.AddField("number", nIngredients);
	//postData.AddField("item_id", allItems[itemToCraft].id);
	postData.AddField("item_id", itemToCraft);
	postData.AddField("vector", cIngredients);
	print("DATELE: " + nUserId + " " + itemToCraft + " " + nIngredients + " " + cIngredients);
	print( "" + itemToCraft + "  " /*itemToCraft.name*/);
	
	var upload : WWW = new WWW(Global.server+"/mmo_iphone/update_item.php", postData);
	yield upload;
	
	while (upload.error && upload.error.ToString().Contains("Resolving host timed out"))
	    {
	    	Debug.Log( "Retrying" );
			upload = new WWW(Global.server+"/mmo_iphone/update_item.php", postData);
			yield upload;
			 Debug.Log(upload + "Aici e lInkul");
	    }
   	
   	print("AM PRIMTI: " + upload.text);
	is_updating = false;
	Global.bNeedToUpdateInv = true;
}

function OnGUI()
{
	//var screenScale: float = Screen.width / 480.0;
    //var scaledMatrix: Matrix4x4 = Matrix4x4.identity.Scale(Vector3(screenScale,screenScale,screenScale));
  //  GUI.matrix = scaledMatrix;
    
	if(!bCraft) 
		return;
	
	//RADU: TUTORIALS if it's the first time displaying, show tutorial overlay
	//CommonConstants.DrawTutorialOverlay( CommonConstants.TUT_CRAFT );
	GUI.DrawTexture(Rect(Global.screenW * 0.2395 ,Global.screenH * 0.1406,Global.screenW * 0.71875 ,Global.screenH * 0.84375), texBack);
	//GUI.DrawTexture(Rect(5, 30, 228, 282), texFrame);
	//GUI.DrawTexture(Rect(243, 30, 228, 282), texFrame);
	
	if(bNeedToUpdateCraft)
		{
			GetCraftItems();
			bNeedToUpdateCraft = false;
		}
	if(is_updating)
		{
			nAngle += 200*Time.deltaTime;
			GUIUtility.RotateAroundPivot(nAngle, Vector2(Global.screenW * 0.5 ,Global.screenH * 0.5));
			GUI.DrawTexture(Rect(Global.screenW * 0.4375 ,Global.screenH * 0.40625,Global.screenW * 0.125 ,Global.screenH * 0.1875), texLoaderWheel);
			GUIUtility.RotateAroundPivot(-nAngle, Vector2(Global.screenW * 0.5 ,Global.screenH * 0.5));
		}
	if(nItems<1 && !is_updating) 
		{
			GUI.Label(Rect(Global.screenW * 0.29166 ,Global.screenH * 0.25,Global.screenW * 0.25 ,Global.screenH * 0.625), "No items available\nfor crafting.", styleText2);
			nCraftPos = -1;
		}
	else
		{
			if(nCraftPos == -1 && !is_updating)
				nCraftPos = nFirstPos;
		}
	if(GUI.Button(Rect(Global.screenW * 0.427 ,Global.screenH * 0.15625,Global.screenW * 0.07291 ,Global.screenH * 0.05625) ,"", styleDiff1))
	    {
	        changedLvl1 = true;
	        changedLvl2 = false;
	        changedLvl3 = false;
	        changedLvl4 = false;
	        changedLvl5 = false;
	        changedLvl6 = false;
	        changedLvl = true;
	        lowerLimit = 0;
	        upperLimit = 9;
	    }
    if(GUI.Button(Rect(Global.screenW * 0.5 ,Global.screenH * 0.15625,Global.screenW * 0.07291 ,Global.screenH * 0.05625),"",styleDiff2))
	    {
	        changedLvl2 = true;
	        changedLvl1 = false;
	        changedLvl3 = false;
	        changedLvl4 = false;
	        changedLvl5 = false;
	        changedLvl6 = false;
	        changedLvl = true;
	        lowerLimit = 10;
	        upperLimit = 19;
	    }
    if(GUI.Button(Rect(Global.screenW * 0.5729 ,Global.screenH * 0.15625,Global.screenW * 0.07291 ,Global.screenH * 0.05625),"",styleDiff3))
	    {
	        changedLvl3 = true;
	        changedLvl2 = false;
	        changedLvl1 = false;
	        changedLvl4 = false;
	        changedLvl5 = false;
	        changedLvl6 = false;
	        changedLvl = true;
	        lowerLimit = 20;
	        upperLimit = 29;
	    }
    if(GUI.Button(Rect(Global.screenW * 0.6458 ,Global.screenH * 0.15625,Global.screenW * 0.07291 ,Global.screenH * 0.05625),"",styleDiff4))
	    {
	        changedLvl4 = true;
	        changedLvl2 = false;
	        changedLvl3 = false;
	        changedLvl1 = false;
	        changedLvl5 = false;
	        changedLvl6 = false;
	        changedLvl = true;
	        lowerLimit = 30;
	        upperLimit = 39;
	    }
    if(GUI.Button(Rect(Global.screenW * 0.7187 ,Global.screenH * 0.15625,Global.screenW * 0.07291 ,Global.screenH * 0.05625),"",styleDiff5))
	    {
	        changedLvl5 = true;
	        changedLvl2 = false;
	        changedLvl3 = false;
	        changedLvl4 = false;
	        changedLvl1 = false;
	        changedLvl6 = false;
	        changedLvl = true;
	        lowerLimit = 40;
	        upperLimit = 49;
	    }
    if(GUI.Button(Rect(Global.screenW * 0.7916 ,Global.screenH * 0.15625,Global.screenW * 0.07291 ,Global.screenH * 0.05625),"",styleDiff6))
	    {
	        changedLvl6 = true;
	        changedLvl2 = false;
	        changedLvl3 = false;
	        changedLvl4 = false;
	        changedLvl5 = false;
	        changedLvl1 = false;
	        changedLvl = true;
	        lowerLimit = 50;
	        upperLimit = 32767;
	    }
    
	var i : int;
	scrollPosition = GUI.BeginScrollView(scrollFrame,scrollPosition,Rect(0, 0, Global.screenW * 0.2708, Global.screenH * 0.0843*nCraftItems));
	nCraftItems = 0;
    var x = 0 ;
	for(i = 0; i<allItems.length; i++)
		{
			if(allItems[i].available && allItems[i].level>=lowerLimit && allItems[i].level<=upperLimit )
				{
		       // Debug.Log("allItems["+i+"] = "+allItems[i].level);
		            
		            styleList = i == nCraftPos ? styleBut : styleButP;
					itemToDisplay.text = "  " + (allItems[i].name.length > 14 ? allItems[i].name.Substring(0,14) + "..":allItems[i].name);
					itemToDisplay.image = texCategoryToDisplay[i];
					
					
					if(GUI.Button(Rect(Global.screenW * 0.03125, Global.screenH * 0.006153846 + (Global.screenH * 0.0843*nCraftItems), Global.screenW * 0.5 ,Global.screenH * 0.0843), itemToDisplay, styleList) || i == nCraftPos)
						{
			                changedLvl = false;	
							sIngredients = "";
							
							cIngredients = "";
							nIngredients = 0;
							
							itemToCraft = allItems[nCraftPos].id;
							nCraftPos = i;
							texCraft = 	texItemToDisplay[i];
							sTitle = allItems[nCraftPos].name.length > 14 ? splitItemName(allItems[nCraftPos].name) : allItems[nCraftPos].name;
							sCraft = (allItems[nCraftPos].brutality > 0 ? ("Brutality : " + allItems[nCraftPos].brutality)+"\n" : "")+
									 (allItems[nCraftPos].accuracy > 0 ? ("Accuracy : " + allItems[nCraftPos].accuracy)+"\n" : "")+
									 (allItems[nCraftPos].fortitude > 0 ? ("Fortitude : " + allItems[nCraftPos].fortitude)+"\n" : "")+
									 (allItems[nCraftPos].attack > 0 ? ("Attack : " + allItems[nCraftPos].attack)+"\n" : "")+
									 (allItems[nCraftPos].defense > 0 ? ("Defense : " + allItems[nCraftPos].defense)+"\n" : "")+
									 (allItems[nCraftPos].health > 0 ? ("Health : " + allItems[nCraftPos].health)+"\n" : "")+
									 (allItems[nCraftPos].regen > 0 ? ("Regen : " + allItems[nCraftPos].regen)+"\n" : "")+
									 ((allItems[nCraftPos].weapon_dmg_min > 0 || allItems[nCraftPos].weapon_dmg_max > 0) ?
									 ("Damage : "	+ allItems[nCraftPos].weapon_dmg_min + " - "
													+ allItems[nCraftPos].weapon_dmg_max)+"\n" : "")+
									 (allItems[nCraftPos].price > 0 ? ("Price : " + allItems[nCraftPos].price)+"\n" : "");
									 
							
							var l : int;
			                var quant : int[]  ;
			                quant = new int[allItems[nCraftPos].craft_id.length];
							
							for(l = 0; l<allItems[nCraftPos].craft_id.length; l++)
								{
				                    quant[l] = allItems[nCraftPos].craft_quantity[l];
									//sIngredients += ""+allItems[nCraftPos].craft_quantity[l];
									if(allItems[nCraftPos].craft_quantity[l] > 1) 
										{
											sIngredients += "  pieces of " + allItems[nCraftPos].id; 
											//idIngredients += allItems[nCraftPos].id;
										}
									else 
										{
											sIngredients += "  piece of " + allItems[nCraftPos].id;
										}
				                    
									var k = -1;
									var bFound = false;
									
									while(k<myItems.length-1 && !bFound)
										{
											k++;
					                        if(myItems[k].id == allItems[nCraftPos].craft_id[l]) bFound = true;
										}
				                    
									sIngredients += "" + myItems[k].name + "   x"+quant[l] + "\n";
									cIngredients += "" + myItems[k].id + ";" + quant[l] + "@";
									nIngredients++;
				                  //  Debug.Log(myItems[k].name + " myItems[k].id =  "+myItems[k].id + " && length = "+allItems[nCraftPos].craft_id.length);
				                    if(allItems[nCraftPos].craft_id.length<=4)
				                            v[l] = myItems[k].id;
				                         //   print("v: " + myItems[k].id + " " + myItems[k].name);
				                      loadItems(allItems[nCraftPos].craft_id.length);
				                    GUI.DrawTexture(Rect(Global.screenW * 0.5875 ,Global.screenH * 0.6875,Global.screenW * 0.08333 ,Global.screenH * 0.125),neededItems[l],ScaleMode.ScaleToFit,true,10.0f);
				                }
						}
					nCraftItems++;
				}
		} 
		
	GUI.EndScrollView();
       //loadItems(allItems[nCraftPos].craft_id.length);
	if(nCraftPos!=-1)
	{
		if ( texCraft != null )
			GUI.DrawTexture(Rect(Global.screenW * 0.5875 ,Global.screenH * 0.2593,Global.screenW * 0.1062 ,Global.screenH * 0.1625), texCraft);
		GUI.Label(Rect(Global.screenW * 0.7083 ,Global.screenH * 0.2593,Global.screenW * 0.29166 ,Global.screenH * 0.125), sTitle, styleText1);
		
		styleCraftIngredients.alignment = TextAnchor.UpperRight;
		
		GUI.Label(Rect(Global.screenW * 0.7083 ,Global.screenH * 0.375,Global.screenW * 0.21875 ,Global.screenH * 0.625), sCraft, styleCraftIngredients);
		//ingredients
		GUI.Label(Rect(Global.screenW * 0.5875 ,Global.screenH * 0.46875,Global.screenW * 0.41666 ,Global.screenH * 0.0625),"INGREDIENTS:",styleText1);
		
		styleCraftIngredients.alignment = TextAnchor.UpperLeft;
		
		GUI.Label(Rect(Global.screenW * 0.5875 ,Global.screenH * 0.5218,Global.screenW * 0.41666 ,Global.screenH * 0.625), sIngredients, styleCraftIngredients);
      
        if(changedLvl==false)
	         for(var j = 0; j<allItems[nCraftPos].craft_id.length;j++)
		       {	
			        GUI.DrawTexture(Rect(Global.screenW * 0.5875 + j * Global.screenW * 0.09375 ,Global.screenH * 0.71875,Global.screenW * 0.0625 ,Global.screenH * 0.09375),neededItems[j],ScaleMode.StretchToFill,true,1);
			      
			          if(j<allItems[nCraftPos].craft_id.length-1)
			        	GUI.Label(Rect(Global.screenW * 0.6608 + j * Global.screenW * 0.09375 ,Global.screenH * 0.7343,Global.screenW * 0.03125 ,Global.screenH * 0.0468),"+",stylePlus);
			        if(quant!=null)
				        if(quant[j]>0)
				        	GUI.Label(Rect(Global.screenW * 0.59375 + j * Global.screenW * 0.09375 ,Global.screenH * 0.8125,Global.screenW * 0.03125 ,Global.screenH * 0.0468),"x"+quant[j],styleCraftIngredients);
		        }
		
	}

	style.normal.background = texCraftBut;
	style.active.background = texCraftButP;
	
	if(nCraftPos!=-1)
		if(GUI.Button(Rect(Global.screenW * 0.7708 ,Global.screenH * 0.8843,Global.screenW * 0.14375 ,Global.screenH * 0.09375), "", styleCraftBut))
			{  
			// Update inventory locally
			//CraftItem();
			/* OLD SHIT
			for(i = 0; i<allItems[nCraftPos].craft_id.length; i++){
				k = -1;
				bFound = false;
	           
				while(k<myItems.length-1 && !bFound){
					k++;
					if(myItems[k].id == allItems[nCraftPos].craft_id[i]) bFound = true;
				}
				myItems[k].quantity -= allItems[nCraftPos].craft_quantity[i];
				if(myItems[k].quantity <= 0)
					bNeedToResetItem = true; 
			}
			k = -1;
			bFound = false;
			while(k<myItems.length-2 && !bFound){
				k++;
				if(myItems[k].id == allItems[nCraftPos].id) bFound = true;
			}
			if(bFound){
				myItems[k].quantity++;
				bNewCraft = false;			
			}else{
				myItems[myItems.length-1] = Item(
											[""+allItems[nCraftPos].id, "1", "0", "0", "0", 
											"0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0-0", "0", "0"]);
				bNewCraft = true;
			} */
			
			switch( allItems[nCraftPos].craft_type )
				{
					case CommonConstants.CRAFT_WEAPON:
						CheckMissions (allItems[nCraftPos].name,"WEAPON");
					break;
					case CommonConstants.CRAFT_ARMOR:
						CheckMissions (allItems[nCraftPos].name,"ARMOR");
					break;
					case CommonConstants.CRAFT_SUMMON:
						CheckMissions (allItems[nCraftPos].name,"SUMMON");
					break;
					case CommonConstants.CRAFT_CONSUMABLE:
						CheckMissions (allItems[nCraftPos].name,"CONSUMABLE");
					break;
					default:
					    CheckMissions (allItems[nCraftPos].name,"");
					break;		
				}
				if(bNeedToResetItem)
					{
						print("RESETNOW");
						nCraftPos = -1;
						bNeedToResetItem = false;
					} 
					
				// Update the items on the server
				print("ajunge aici 1234567890");
				UpdateItems();
				
				GetCraftItems();
				//Debug.Log(GetCraftItems());
				//Debug.Log("Craft succesful");
				sCraft = "\nCraft successful!";
				sIngredients = "";
			}
	style.normal.background = texBackBut;
	style.active.background = texBackButP;
	if(GUI.Button(Rect(Global.screenW * 0.5791 ,Global.screenH * 0.8843,Global.screenW * 0.14375 ,Global.screenH * 0.09375), "", styleBackBut))
		{
			craftBack = true;
			scriptMain.bCharFrame = true;
			scriptMain.makeActiveOrInactive = true;
			bCraft = false;
			scriptMain.bGUI = true;
			Global.bNeedToUpdateInv = true;
			butDown = true;
		}
	
}

function splitItemName( itemName : String) : String
{
	var str : String;
	var split : String[];
	var temp : String;
	var i : int; 
	
	str = "";
	temp = "";
	split = Regex.Split(itemName," ");
	
	if(split.length>1)
		{
			for(i = 0; i< split.length; i++)
				{
					if(split[i].length>14)
						{
							str+=split[i].Substring(0,14)+"..";
							break; 
						}
					else
						{
							temp = str + split[i];
							if(temp.length>15)
								{
									str += "\n"+split[i];
								}
							else
								{
									str +=split[i]+" ";
								}
						}
				}
		}
	else
		{
			str = itemName.Substring(0,14)+"..";
		}
	return str;
}

function CheckMissions(elem:String,type:String)
{
  for (var i:int=0;i<Global.missionsArray.length;i++)
	  {
		  var q : Mission ;
		  q=Global.missionsArray[i];
		
		  if (q.toDo.Contains("CRAFT"))
		      //craft and equip - string contains +,quant should be 0
		      if(q.toDo.Contains("+") && q.quant == 0 || q.done < q.quant) 
			       if(elem.ToUpper().Contains(q.what)||(type!=""&&type.ToUpper()==q.what)) 
				       { 
					        q.UpdateMission(1);       
					        var url = Global.server + "/mmo_iphone/update_player_mission.php?mission_id="+q.missionId.ToString()+"&player_id="+Global.myChar.id+"&procent=" + q.done.ToString();
					       	var post = new WWW(url);
					        yield(post); 
					      
					          while (post.error && post.error.ToString().Contains("Resolving host timed out"))
						    	{
							      Debug.Log( "Retrying" );
						          post = new WWW(url);
						          yield(post); 
						    	}
				        }
	     }    
} 

//added by Claudiu
function loadItems(length :int)
{
  var i :int; 
   for(i=0 ; i <length; i++)
	    {    
	        neededString[i] = "Menus/Inventory/Icons/"+v[i];
	 		neededItems[i] = Resources.Load(neededString[i]);
	    }
}

/*function CraftItem()
{
	var CheckAllMats : boolean = true;
	
	yield Inventory.self.GetInventoryItems();
	
	for(int i = 0; i<allItems[nCraftPos].craft_id.length; i++)
	{
		CheckAllMats = Inventory.self.UnlootItem(allItems[nCraftPos].craft_id[i], allItems[nCraftPos].craft_quantity[i]);
		if ( CheckAllMats == false )
			break;
	}
	if ( CheckAllMats )
		LootItem(allItems[nCraftPos].id);
	else
		yield Inventory.self.GetInventoryItems();
}*/

//Mihai: this doesnt seems to be used anywhere
//function LootItem(id : int)
//{
//	yield Inventory.self.LootItem(id);
//	yield Inventory.self.SendInventoryItems();
//}