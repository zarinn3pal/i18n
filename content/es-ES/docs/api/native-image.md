# NativeImage

> Crea iconos de bandeja, base y aplicación usando archivos PNG o JPG.

Proceso [Main](../glossary.md#main-process), [Renderer](../glossary.md#renderer-process)

En Electron, para las APIs que toman imágenes, se puede pasar cualquier ruta de archivo o las instancias `NativeImage`. Una imagen vacía será utilizada cuando se pasa `null`.

Por ejemplo, cuando se crea una bandeja o se configura un icono de la ventana, se puede pasar una ruta de archivo de imagen como un `String`:

```javascript
const { BrowserWindow, Tray } = require('electron')

const appIcon = new Tray('/Users/somebody/images/icon.png')
let win = new BrowserWindow({ icon: '/Users/somebody/images/window.png' })
console.log(appIcon, win)
```

O leer la imagen desde el portapapeles, lo cual devuelve un `NativeImage`:

```javascript
const { clipboard, Tray } = require('electron')
const image = clipboard.readImage()
const appIcon = new Tray(image)
console.log(appIcon)
```

## Formatos Soportados

Actualmente los formatos de imagen `PNG` and `JPEG` son soportados. Se recomienda`PNG` debido a su soporte a la transparencia y la compresión sin pérdida de información.

En Windows, también pueden cargarse iconos `ICO` desde las rutas de archivo. Para mejor calidad visual se recomienda incluir al menos los siguientes tamaños en el:

* Ícono pequeño 
 * 16x16 (100% DPI scale)
 * 20x20 (125% DPI scale)
 * 24x24 (150% DPI scale)
 * 32x32 (200% DPI scale)
* Ícono Grande 
 * 32x32 (100% DPI scale)
 * 40x40 (125% DPI scale)
 * 48x48 (150% DPI scale)
 * 64x64 (200% DPI scale)
* 256x256

Revise la sección *Size requirements* en [este artículo](https://msdn.microsoft.com/en-us/library/windows/desktop/dn742485(v=vs.85).aspx).

## Imagen de alta resolución

En las plataformas compatibles con altos PPP como las pantallas Apple Retina, se puede anexar `@2x` luego del nombre del archivo base de la imagen para marcarlo como una imagen de alta resolución.

Por ejemplo, si `icon.png` es una imagen normal que tiene una resolución estándar, entonces `icon@2x.png` será tratado como una imagen de alta resolución que tiene una densidad doble de PPP.

Si se desea soportar pantallas con distintas densidades PPP al mismo tiempo, se pueden poner imágenes con distintos tamaños en la misma carpeta y usar el nombre del archivo sin los sufijos PPP. Por ejemplo:

```plaintext
images/
├── icon.png
├── icon@2x.png
└── icon@3x.png
```

```javascript
const { Tray } = require('electron')
let appIcon = new Tray('/Users/somebody/images/icon.png')
console.log(appIcon)
```

También se admiten los siguientes sufijos para PPP:

* `@1x`
* `@1.25x`
* `@1.33x`
* `@1.4x`
* `@1.5x`
* `@1.8x`
* `@2x`
* `@2.5x`
* `@3x`
* `@4x`
* `@5x`

## Imagen de plantilla

Las imágenes de plantillas consisten en un canal negro y alfa. La imágenes de plantillas no están destinadas a ser usadas como imágenes independientes y usualmente se mezclan con otro contenido para crear la apariencia deseada final.

El caso más común es usar imágenes de plantilla para un icono de barra de menú para que pueda adaptarse a barras de menú tanto claras como oscuras.

**Nota:** La imagen de plantilla sólo es soportada en macOS.

Para marcar una imagen como una imagen de plantilla, su nombre de archivo debe terminar con la palabra `Template`. Por ejemplo:

* `xxxTemplate.png`
* `xxxTemplate@2x.png`

## Métodos

El módulo `nativeImage` tiene los siguientes métodos, de los cuales todos devuelven una instancia de la clase `NativeImage`:

### `nativeImage.createEmpty()`

Devuelve `NativeImage`

Crea una instancia vacía `NativeImage`.

### `nativeImage.createFromPath(path)`

* `path` Cadena

Devuelve `NativeImage`

Crea una instancia `NativeImage` desde un archivo ubicado en `path`. Este método devuelve una imagen si la `path` no existe, o si no puede ser leída o si la imagen no es válida.

```javascript
const nativeImage = require('electron').nativeImage

let image = nativeImage.createFromPath('/Users/somebody/images/icon.png')
console.log(image)
```

### `nativeImage.createFromBitmap(buffer, options)`

* `buffer` [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer)
* `options` Object * `width` Integer * `height` Integer * `scaleFactor` Double (opcional) - Por defecto es 1.0.

Devuelve `NativeImage`

Crea una nueva instancia de `NativeImage` desde `buffer` que contiene los datos del mapa de bits crudo devueltos por `toBitmap()`. El formato específico es dependiente de la plataforma.

### `nativeImage.createFromBuffer(buffer[, options])`

* `buffer` [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer)
* `options` Objeto (opcional) * `width` Entero (opcional) - Necesario para los búferes de mapa de bits. * `height` Entero (opcional) - Necesario para los búferes de mapa de bits. * `scaleFactor` Doble (opcional) -Por defecto es 1.0.

Devuelve `NativeImage`

Crea una nueva instancia de `NativeImage` desde `buffer`. Intenta primer decodificar como PNG o JPEG.

### `nativeImage.createFromDataURL(dataURL)`

* `dataURL` Cadena

Devuelve `NativeImage`

Crea una nueva instancia `NativeImage` desde `dataURL`.

### `nativeImage.createFromNamedImage(imageName[, hslShift])` *macOS*

* `imageName` String
* `hslShift` Number[] (optional)

Devuelve `NativeImage`

Crea una nueva instancia de `NativeImage` a partir de NSImage vinculada con el nombre especificado. See [`System Icons`](https://developer.apple.com/design/human-interface-guidelines/macos/icons-and-images/system-icons/) for a list of possible values.

El `hslShift` se aplica a la imagen con las siguientes reglas

* `hsl_shift[0]` (tonalidad): El valor de tonalidad absoluto para la imagen - 0 y 1 se mapean a 0 y 360 en la rueda de tonalidad de color (rojo).
* `hsl_shift[1]` (saturación): Cambio en la saturación de la imagen, con las siguientes valores clave: 0 = eliminar todo el color. 0.5 = sin cambios. 1 = saturación completa de la imagen.
* `hsl_shift[2]` (luminosidad): Un cambio de luminosidad para la imagen, con los siguientes valores clave: 0 = elimine toda la luminosidad (hace que todos los píxeles sean negros). 0.5 = Dejar sin cambios. 1 = Luminosidad total (hace que todos los píxeles sean blancos).

Esto significa que `[-1, 0, 1]` hará la imagen completamente blanca y `[-1, 1, 0]` la hará completamente negra.

En algunos casos, el `NSImageName` no coincide con su cadena de representación; un ejemplo de esto es `NSFolderImageName`, cuya cadena de representación en realidad sería `NSFolder`. Por lo tanto, necesitar determinar la cadena de representación correcta para su imagen antes de pasarla. Esto puede hacer con lo siguiente:

`echo -e '#import <Cocoa/Cocoa.h>\nint main() { NSLog(@"%@", SYSTEM_IMAGE_NAME); }' | clang -otest -x objective-c -framework Cocoa - && ./test`

donde `SYSTEM_IMAGE_NAME` debe ser reemplazado con cualquier valor de [this list](https://developer.apple.com/documentation/appkit/nsimagename?language=objc).

## Clase: NativeImage

> Envuelve nativamente imágenes como la bandeja, el muelle y los íconos de las aplicaciones.

Proceso: [Main](../glossary.md#main-process), [Renderer](../glossary.md#renderer-process)

### Métodos de Instancia

Los siguientes métodos están disponibles para las distancias de la clase `NativeImage`:

#### `image.toPNG([options])`

* `options` Objeto (opcional) * `scaleFactor` Doble (opcional) - Por defecto es 1.0.

Devuelve `Buffer` - Un [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) que contiene la información codificada de la imagen `PNG`.

#### `image.toJPEG(quality)`

* `quality` Integer - Between 0 - 100.

Devuelve `Buffer` - Un [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer)que contiene la información codificada de la imagen `JPEG`.

#### `image.toBitmap([options])`

* `options` Objeto (opcional) * `scaleFactor` Doble (opcional) - Por defecto es 1.0.

Devuelve `Buffer` - Un [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) que contiene una copia de la información sin procesar de pixeles del mapa de bits de la imagen.

#### `image.toDataURL([options])`

* `options` Objeto (opcional) * `scaleFactor` Doble (opcional) - Por defecto es 1.0.

Devuelve `String` - El URL de información de la imagen.

#### `image.getBitmap([options])`

* `options` Objeto (opcional) * `scaleFactor` Doble (opcional) - Por defecto es 1.0.

Devuelve `Buffer` - Un [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) que contiene la información sin procesar de pixeles del mapa de bits de la imagen.

La diferencia entre `getBitmap()` y `toBitmap()` es que `getBitmap()` no copia la informacion del mapa de bits, así que hay que utilizar el Buffer devuelto inmediatamente en el tic del bucle del evento actual, de lo contrario la información puede ser cambiada o destruida.

#### `image.getNativeHandle()` *macOS*

Devuelve `Buffer` - Un [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) que almacena el puntero C en el controlador nativo subyacente de la imagen. En macOS, se devolverá un puntero a la instancia `NSImage`.

Observe que el puntero devuelto es un puntero debil a la imagen nativa subyacente en lugar de una copia. Por lo tanto, *debe * asegurarse que la instancia asociada `nativeImage` se encuentre cerca.

#### `image.isEmpty()`

Devuelve `Boolean` - Si la imagen está vacía.

#### `image.getSize()`

Devuelve [`Size`](structures/size.md)

#### `image.setTemplateImage(option)`

* `option` Booleano

Marca la imagen como una imagen de plantilla.

**[Cambiar](modernization/property-updates.md)**

#### `image.isTemplateImage()`

Devuelve `Boolean` - Si la imagen es una imagen de plantilla.

**[Cambiar](modernization/property-updates.md)**

#### `image.crop(rect)`

* `rect` [Rectangle](structures/rectangle.md) - El área de la imagen para ser recortada.

Devuelve `NativeImage` - La imagen recortada.

#### `image.resize(options)`

* `options` Objeto * `width` Entero (opcional) - Por defecto es el ancho de la imagen. * `height` Entero (opcional) - El valor predeterminado es la altura de la imagen. * `quality` String (opcional) - La calidad deseada para el cambio de tamaño de imagen. Los valores posibles son `good`, `better` or `best`. Por defecto es `best`. Estos valores expresan una compensación de calidad/velocidad deseada. Son traducidas dentro de un método de algoritmo específico que depende de las capacidades (CPU, GPU) de la plataforma subyacente. Es posible asignar los tres métodos con el mismo algoritmo en una plataforma determinada.

Devuelve `NativeImage` - La imagen redimensionada.

Si solo la `height` o la `width` son especificadas, entonces la relación de aspecto actual se conservará en la imagen redimensionada.

#### `image.getAspectRatio()`

Devuelve `Float` - La relación de aspecto de la imagen.

#### `image.addRepresentation(options)`

* `options` Objeto * `scaleFactor` Doble - El factor de escala para agregar la representación de la imagen. * `width` Entero (opcional) - Por defecto es 0. Es necesario si un búfer de mapa de bits se especifica como `buffer`. * `height` Entero (opcional) - Por defecto es 0. Es necesario si un búfer de mapa de bits se especifica como `buffer`. `buffer` Buffer (opcional) - El búfer que contiene los datos sin procesar de la imagen. `dataURL` Cadena (opcional) - El URL de información que contiene ya sea una imagen JPEG o PNG codificada en base64.

Añade una representación de imagen para un factor de escala específico. Esto puede utilizarse para agregar explícitamente distintas representaciones de factor de escala a una imagen. Este puede ser llamado en imágenes vacías.

## Propiedades

### `nativeImage.isMacTemplateImage` *macOS*

A `Boolean` property that determines whether the image is considered a [template image](https://developer.apple.com/documentation/appkit/nsimage/1520017-template).

Please note that this property only has an effect on macOS.