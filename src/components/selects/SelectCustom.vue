<template>
  <div class="contenedor-select" ref="ComponenteHTML" style="width: 100">
    <div class="input-form">
      <input
        class="form-control-sm form-control input-text"
        :placeholder="$props.placeholder"
        @focus="_fnFocusInput('Activar')"
        @click="_fnFocusInput('Activar')"
        @keyup.enter="_fnSeleccionarItem(item, 'Enter')"
        v-model="filtrar"
      />
      <span
        class="fa fa-times"
        v-if="!typing"
        @click="_fnEventoFiltrar()"
      ></span>
      <span v-if="typing" style="height: 27px">^</span>
    </div>
    <div class="data-content ocultar" ref="DivContent">
      <div
        class="item-data"
        :class="index == indexSelected ? 'active' : ''"
        @click="_fnSeleccionarItem(item, 'Default', index)"
        :key="item.id"
        v-for="(item, index) in _comSetearData"
      >
        <div class="item">
          <!-- <span style="font-size: 11px">{{ item.razonSocial }}</span> -->
          <div class="">
            <span style="font-size: 11px">{{ item[props.itemName] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { mount } from "@vue/test-utils";

export interface IStateCliente {
  id: number;
  razonSocial: string;
  ruc: string;
  tarifaHora: string;
  moneda: string;
}

export interface IPropSelectCliente {
  data: Array<any>;
  placeholder: string;
  itemName: string;
}

export type EnumUpDowm = "Up" | "Down" | "Default" | "Initial" | "Enter";

const props = defineProps<IPropSelectCliente>();
const indexSelected = ref<any>(null);
const itemSelected = ref<any | null>(null);
const sinData = ref<boolean>(true);
const totalData = ref<number>(0);
const filtrar = ref<string>("");
const typing = ref<boolean>(true);
let ListaAux = ref([]);

const resetInput = ref<boolean>(false);

// *REFERENCIAS

const DivContent = ref<HTMLDivElement | null>(null);
const ComponenteHTML = ref<HTMLDivElement | null>(null);

// *EMITS
const emits = defineEmits<{ (e: "selectedItem", item: any): void }>();

// * FUNCIONES

const _fnMoverScroll = (type: "Up" | "Down") => {
  const elemt = DivContent.value as HTMLDivElement;
  // console.log(elemt.style.top)
  // const pixel=parseInt();
  // console.log(pixel)
};

const _fnSeleccionarItem = (
  item: any,
  upDown: EnumUpDowm = "Default",
  index: number = 0
) => {
  const html = DivContent.value as HTMLDivElement;

  switch (upDown) {
    case "Initial": {
      if (ListaAux.value.length > 0) {
        itemSelected.value = ListaAux.value[0];
        indexSelected.value = 0;
      }

      break;
    }
    case "Enter": {
      if (ListaAux.value.length > 0) {
        itemSelected.value = ListaAux.value[indexSelected.value];
        html.classList.remove("mostrar");
      }

      break;
    }
    case "Default": {
      // console.log("seleccionar index", index);
      // console.log("seleccionar upDown", upDown);
      // console.log("seleccionar item", item);
      // console.log("seleccionar filtrar", filtrar);
      typing.value = false;
      resetInput.value = false;
      itemSelected.value = ListaAux.value[index];
      indexSelected.value = index;
      emits("selectedItem", item);
      html.classList.remove("mostrar");
      break;
    }
    case "Down": {
      _fnMoverScroll("Down");
      indexSelected.value = indexSelected.value + 1;
      if (ListaAux.value.length > indexSelected.value) {
        itemSelected.value = ListaAux.value[indexSelected.value];
      } else {
        indexSelected.value = totalData.value - 1;
      }
      break;
    }

    case "Up": {
      _fnMoverScroll("Up");
      indexSelected.value = indexSelected.value - 1;
      if (indexSelected.value > 0) {
        itemSelected.value = ListaAux.value[index];
      } else {
        indexSelected.value = 0;
      }
      break;
    }
  }

  if (itemSelected.value != null) {
    filtrar.value = itemSelected.value[props.itemName];
  }
  // else {
  //   filtrar.value = "";
  //   itemSelected.value = null;
  //   // emits("selectedItem", null);
  // }
  // emits('selectedItem', item)
};

const _fnIniciarEstados = () => {
  itemSelected.value = null;
  indexSelected.value = 0;
  totalData.value = 0;
  sinData.value = true;
};

const _fnFocusInput = (type: "Activar" | "Ocultar" = "Activar") => {
  const html = DivContent.value as HTMLDivElement;
  html.classList.add("mostrar");
};

const _fnEventoFiltrar = () => {
  typing.value = !typing.value;
  resetInput.value = true;
  itemSelected.value = null;
  filtrar.value = "";
  // indexSelected.value = 0;
  emits("selectedItem", null);
  // indexSelected.value = 0;
  // itemSelected.value = null;
  // filtrar.value = "";
  // const html = DivContent.value as HTMLDivElement;
  // html.classList.add("mostrar");
};

const _fnFiltrar = ({ target }) => {
  const { value } = target;
  if (value == "") {
    typing.value = true;
    resetInput.value = true;
    itemSelected.value = null;
    filtrar.value = "";
  } else {
    typing.value = false;
    resetInput.value = false;
    const div = DivContent.value as HTMLDivElement;
    div.classList.add("mostrar");
  }
};

const _fnEscucharClick = () => {
  document.addEventListener("mouseup", function (event) {
    const html = ComponenteHTML.value as HTMLElement;
    // console.log(html)
    if (event != null && html != null && !html.contains(event.target)) {
      const div = DivContent.value as HTMLDivElement;
      div.classList.remove("mostrar");
      // alert("Click fuera del elemento!");
    }
    // else {
    //   alert("Click dentro del elemnto detectado");
    // }
  });
};

// * ON MOUNTED
onMounted(() => {
  _fnEscucharClick();
  // _comSetearData.value=props.data
});

//*PROPIEDADES COMPUTADAS
const _comSetearData = computed(() => {
  // _fnIniciarEstados()
  let _ListaAux: any = [];
  // console.log('computed')
  if (props.data != undefined) {
    if (props.data.length > 0) {
      if (typing.value) {
        // console.log('Filtrando ...')
        // _ListaAux = props.data.filter(
        //   (x: any) =>
        //     x.ruc.trim().indexOf(filtrar.value.trim()) != -1 ||
        //     x.razonSocial
        //       .trim()
        //       .toLowerCase()
        //       .indexOf(filtrar.value.trim().toLowerCase()) != -1
        // );

        // ? validar este filtro al momento de escribir

        const filtrarAux = filtrar.value.trim().toUpperCase();
        // console.log("evento filtrar", filtrarAux);
        _ListaAux = props.data.filter(
          (x: any) =>
            x[props.itemName].trim().toUpperCase().indexOf(filtrarAux) != -1
        );
      } else {
        // console.log("reset input", resetInput.value);
        totalData.value = props.data.length;
        sinData.value = false;
        _ListaAux = props.data;
        let itemSeleccionadoAux = null;
        filtrar.value = "";
        if (indexSelected.value != null && !resetInput.value) {
          itemSelected.value = props.data[indexSelected.value];
          filtrar.value = itemSelected.value[props.itemName];
          itemSeleccionadoAux = itemSelected.value;
        }
        // emits("selectedItem", itemSeleccionadoAux);
      }
    } else _ListaAux = [];
  } else _ListaAux = [];
  ListaAux.value = _ListaAux;
  return _ListaAux;
});
</script>

<style lang="scss">
.contenedor-select {
  position: relative;

  .input-form {
    width: 100%;
    position: relative;

    .input-text {
      font-size: 12px;
      padding-right: 30px;
    }

    span {
      color: gray;
      font-size: 12px;
      position: absolute;
      top: 0px;
      right: 0px;
      display: block;
      background: rgba(128, 128, 128, 0.18);
      border-left: 1px solid rgba(128, 128, 128, 0.18);
      padding: 8px 8px;
      border-radius: 2px;
      cursor: pointer;
    }
  }

  .data-content.ocultar {
    display: none;
  }

  .data-content.mostrar {
    display: block;
  }

  .data-content {
    border-radius: 10px;
    background: white;
    position: absolute;
    width: 100%;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.66);
    overflow-y: auto;
    max-height: 500px;
    z-index: 999;

    .item-data {
      border-bottom: 1px solid rgba(79, 79, 79, 0.32);

      .item {
        padding: 5px 10px;
      }

      font-size: 12px;
    }

    .item-data:hover {
      background: rgba(30, 56, 82, 0.5);
      cursor: pointer;
      color: white;
    }

    .item-data.active {
      background: #1e3852;
      cursor: pointer;
      color: white;
    }
  }
}
</style>
