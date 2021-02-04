<template>
  <b-container>
    <b-row>
      <b-col></b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4>DASN - Declaração Anual do Simples Nacional</h4>
        <table class="table table-bordered table-sm">
          <tbody>
            <tr>
              <th class="text-center" colspan="2">
                RELATÓRIO MENSAL DAS RECEITAS BRUTAS
              </th>
            </tr>
            <tr>
              <td colspan="2">CNPJ: {{ settings.cnpj }}</td>
            </tr>
            <tr>
              <td colspan="2">Empreendedor individual:</td>
            </tr>
            <tr>
              <td colspan="2">Período de apuração:</td>
            </tr>
            <tr>
              <th class="text-center" colspan="2">
                RECEITA BRUTA MENSAL – REVENDA DE MERCADORIAS (COMÉRCIO)
              </th>
            </tr>
            <tr>
              <td>
                I – Revenda de mercadorias com dispensa de emissão de documento
                fiscal
              </td>
              <td>{{ $money(totalMonth) }}</td>
            </tr>
            <tr>
              <td>II – Revenda de mercadorias com documento fiscal emitido</td>
              <td></td>
            </tr>
            <tr>
              <td>
                III – Total das receitas com revenda de mercadorias (I + II)
              </td>
              <td></td>
            </tr>
            <tr>
              <th class="text-center" colspan="2">
                RECEITA BRUTA MENSAL – VENDA DE PRODUTOS INDUSTRIALIZADOS
                (INDÚSTRIA)
              </th>
            </tr>
            <tr>
              <td>
                IV – Venda de produtos industrializados com dispensa de emissão
                de documento fiscal
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                V – Venda de produtos industrializados com documento fiscal
                emitido
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                VI – Total das receitas com venda de produtos industrializados
                (IV + V)
              </td>
              <td></td>
            </tr>
            <tr>
              <th class="text-center" colspan="2">
                RECEITA BRUTA MENSAL – PRESTAÇÃO DE SERVIÇOS
              </th>
            </tr>
            <tr>
              <td>
                VII – Receita com prestação de serviços com dispensa de emissão
                de documento fiscal
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                VIII – Receita com prestação de serviços com documento fiscal
                emitido
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                IX – Total das receitas com prestação de serviços (VII + VIII)
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <b
                  >X - Total geral das receitas brutas no mês (III + VI + IX)</b
                >
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                LOCAL E DATA:
                <p>&nbsp;</p>
              </td>
              <td>ASSINATURA DO EMPRESÁRIO:</td>
            </tr>
            <tr>
              <td colspan="2">
                ENCONTRAM-SE ANEXADOS E ESTE RELATÓRIO:
                <ul style="list-style: none; padding-left: 1rem">
                  <li>
                    - Os documentos fiscais comprobatórios das entradas de
                    mercadorias e serviços tomados referentes ao período;
                  </li>
                  <li>
                    - As notas fiscais relativas às operações ou prestações
                    realizadas eventualmente emitidas.
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      settings: (state) => state.settings,
    }),
  },

  data() {
    return {
      totalMonth: 0,
    };
  },

  methods: {
    getTotalByMonth() {
      fetch(`http://localhost:3000/requests/by-month?month=10&year=2020`)
        .then((resp) => resp.json())
        .then((json) => {
          let total = 0;
          json.requests.map((el) => {
            el.items.map((item) => (total += item.price * item.quantity));
            total += el.deliverIn.taxa;
          });
          this.totalMonth = total;
        });
    },
  },

  mounted() {
    this.getTotalByMonth();
  },
};
</script>

<style>
</style>