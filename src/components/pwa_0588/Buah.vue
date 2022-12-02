<template>
    <v-main class="list">
        <v-card>
            <v-list-item>
                <v-list-item-avatar> <img
                        src="https://thumbs.dreamstime.com/b/cute-panda-bear-cartoon-chef-vectorcooking-cookie-sweet-bakery-cute-panda-bear-cartoon-chef-vector-cooking-cookiesweet-bakery-216614619.jpg"
                        alt="John"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">Buah </v-list-item-title>
                    <v-list-item-subtitle>by NPM Kalian</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide details
                    style="margin-top: 30px"></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="todos" :search="search" item-key="name" class="elevation-1">
                <template v-slot:[`item.stok`]="{ item }">
                    <v-chip :color="getColor(item.stok)" style="color: white;">
                        {{ item.stok }}
                    </v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn class="ma-2" outlined small color="error" @click="editItem(item)"><v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn class="ma-2" outlined small color="success" @click="openDelete(item)">
                        <v-icon>
                            mdi-trash-can-outline
                        </v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog transition="dialog-top-transition" v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-toolbar color="brown darken-1" dark class="headline">Tambah Buah</v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.name" label="Name" required></v-text-field>
                        <v-text-field v-model="formTodo.stok" label="stok" suffix="Buah" required></v-text-field>
                        <v-text-field v-model="formTodo.harga" label="harga" prefix="$" required></v-text-field>
                        <v-select v-model="formTodo.status" :items="[`Segar`, `Sangat Baik`, 'Hampir Busuk']"
                            label="Status" required></v-select>
                        <v-combobox v-model="select" :items="items" label="Penyimpanan" outlined
                            dense></v-combobox>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline"> Edit Buah </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.name" label="Name" required></v-text-field>
                        <v-text-field v-model="formTodo.stok" label="stok" suffix="Buah" required></v-text-field>
                        <v-text-field v-model="formTodo.harga" label="harga" prefix="$" required></v-text-field>
                        <v-select v-model="formTodo.status" :items="[`Segar`, `Sangat Baik`, 'Hampir Busuk']"
                            label="Status" required></v-select>
                        <v-combobox v-model="select" :items="items" label="Penyimpanan" outlined
                            dense></v-combobox>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelEdit"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveEdit"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" persistent max-width="290">
            <template v-slot:activator="{}">
            </template>
            <v-card>
                <v-card-title class="text-h5">
                    Are you sure to delete?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialogDelete = false">
                        cancel
                    </v-btn>
                    <v-btn color="red darken-1" text @click="deleteItem()">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>
<script>
export default {
    name: "BuahList",
    data() {
        return {
            tempPriority: "",
            editItemnya: {},
            indexnya: 0,
            indexnyaEdit: 0,
            search: null,
            dialog: false,
            dialogEdit: false,
            dialogDelete: false,
            snackbar: false,
            timeout: 1000,
            itemContent: [],
            indexItem: null,
            headers: [
                {
                    text: "Name",
                    align: "start",
                    sortable: true,
                    value: "name",
                },
                { text: "stok", value: "stok" },
                { text: "harga", value: "harga" },
                { text: "Status", value: "status" },
                { text: "Actions", value: "actions" },
            ],
            todos: [
                {
                    name: "Apple",
                    stok: 120,
                    harga: 10000,
                    status: "Segar",
                    penyimpanan: "Kulkas"
                },
                {
                    name: "Jeruk",
                    stok: 350,
                    harga: 5000,
                    status: "Sangat Baik",
                    penyimpanan: "Suhu Rendah"
                },
                {
                    name: "Anggur",
                    stok: 450,
                    harga: 1000,
                    status: "Hampir Busuk",
                    penyimpanan: "Luar Ruangan"
                },
            ],
            formTodo: {
                name: null,
                stok: null,
                harga: null,
                status: null,
                penyimpanan: null,
            },
            formTodoEdit: {
                name: null,
                stok: null,
                harga: null,
            },
            items: [
                'Kulkas',
                'Suhu Rendah',
                'Luar Ruangan',
                'Lembab',
            ],
        };
    },
    methods: {
        save() {
            // tambahkan code untuk dapat menyimpan data yang ingin ditambah
            this.todos.push(this.formTodo);
            this.resetForm()
            this.dialog = false
        },
        cancel() {
            // tambahkan code untuk batal tambah data
            this.resetForm()
            this.dialog = false
        },
        openDelete(item) {
            this.dialogDelete = true
            for (let i = 0; i < this.todos.length; i++) {
                if (this.todos[i].task === item.task) {
                    this.indexnya = i
                }
            }
        },
        deleteItem() {
            this.todos.splice(this.indexnya, 1);
            this.dialogDelete = false
        },
        editItem(item) {
            this.dialogEdit = true
            this.formTodo.name = item.name
            this.formTodo.stok = item.stok
            this.formTodo.harga = item.harga
            this.formTodo.status = item.status
            this.formTodo.penyimpanan = item.penyimpanan
            this.editItemnya = item
        },
        saveEdit() {
            this.editItemnya.name = this.formTodo.name
            this.editItemnya.stok = this.formTodo.stok
            this.editItemnya.harga = this.formTodo.harga
            this.editItemnya.status = this.formTodo.status
            this.editItemnya.penyimpanan = this.formTodo.penyimpanan
            this.dialogEdit = false
        },
        cancelEdit() {
            this.resetForm()
            this.dialogEdit = false
        },
        resetForm() {
            this.formTodo = {
                name: null,
                stok: null,
                harga: null,
                status: null,
            };
            this.formTodoEdit = {
                name: null,
                stok: null,
                harga: null,
                status: null,
            };
        },
        getColor(prior) {
            if (prior > 100 && prior < 300) return 'green'
            else if (prior > 300 && prior < 400) return 'yellow'
            else return 'red'
        },
        //tambahkan code untuk delete data
        //tambahkan code untuk menampilkan data list yang ingin diedit
        //tambahkan code untuk memberikan ketentuan warna sesuai stok
    },
};
</script>
<style>
.text {
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    font-size: 40px;
    font-style: italic;
}
</style>